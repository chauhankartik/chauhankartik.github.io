"""
RESP (REdis Serialization Protocol) Serializer & Streaming Parser
Production-grade, non-blocking stream decoder for RESP 2 & 3.
"""

from typing import Any, Tuple, Optional, List, Union


class RespError(Exception):
    """Represents a Redis protocol error."""
    pass


def serialize_simple_string(s: str) -> bytes:
    return f"+{s}\r\n".encode("utf-8")


def serialize_error(message: str) -> bytes:
    if not message.startswith("ERR") and not message.startswith("WRONGTYPE"):
        message = f"ERR {message}"
    return f"-{message}\r\n".encode("utf-8")


def serialize_integer(num: int) -> bytes:
    return f":{num}\r\n".encode("utf-8")


def serialize_bulk_string(data: Optional[Union[str, bytes]]) -> bytes:
    if data is None:
        return b"$-1\r\n"
    if isinstance(data, str):
        raw = data.encode("utf-8")
    else:
        raw = data
    return f"${len(raw)}\r\n".encode("ascii") + raw + b"\r\n"


def serialize_array(elements: Optional[List[Any]]) -> bytes:
    if elements is None:
        return b"*-1\r\n"
    parts = [f"*{len(elements)}\r\n".encode("ascii")]
    for elem in elements:
        parts.append(serialize(elem))
    return b"".join(parts)


def serialize(value: Any) -> bytes:
    """Polymorphic serializer for native Python types to RESP."""
    if value is None:
        return serialize_bulk_string(None)
    if isinstance(value, bool):
        return serialize_integer(1 if value else 0)
    if isinstance(value, int):
        return serialize_integer(value)
    if isinstance(value, str):
        return serialize_bulk_string(value)
    if isinstance(value, bytes):
        return serialize_bulk_string(value)
    if isinstance(value, list) or isinstance(value, tuple) or isinstance(value, set):
        return serialize_array(list(value))
    if isinstance(value, Exception):
        return serialize_error(str(value))
    return serialize_bulk_string(str(value))


def parse_resp_stream(buf: bytes) -> Tuple[Optional[Any], int]:
    """
    Attempts to parse a single complete RESP value from buf.
    Returns:
        (value, bytes_consumed) if a complete frame was parsed.
        (None, 0) if the buffer has an incomplete frame and needs more data.
    """
    if not buf:
        return None, 0

    prefix = buf[0:1]

    # Simple String (+), Error (-), Integer (:)
    if prefix in (b'+', b'-', b':'):
        crlf_idx = buf.find(b"\r\n")
        if crlf_idx == -1:
            return None, 0
        raw_payload = buf[1:crlf_idx].decode("utf-8", errors="replace")
        consumed = crlf_idx + 2

        if prefix == b'+':
            return raw_payload, consumed
        elif prefix == b'-':
            return RespError(raw_payload), consumed
        elif prefix == b':':
            try:
                return int(raw_payload), consumed
            except ValueError:
                raise RespError(f"Protocol error: invalid integer {raw_payload}")

    # Bulk String ($)
    elif prefix == b'$':
        crlf_idx = buf.find(b"\r\n")
        if crlf_idx == -1:
            return None, 0
        try:
            length = int(buf[1:crlf_idx])
        except ValueError:
            raise RespError("Protocol error: invalid bulk length")

        if length == -1:
            # Null bulk string
            return None, crlf_idx + 2

        start_data = crlf_idx + 2
        end_data = start_data + length
        total_frame = end_data + 2  # data + trailing \r\n

        if len(buf) < total_frame:
            # Incomplete bulk string data
            return None, 0

        if buf[end_data:total_frame] != b"\r\n":
            raise RespError("Protocol error: expected CRLF after bulk data")

        payload = buf[start_data:end_data]
        return payload, total_frame

    # Array (*)
    elif prefix == b'*':
        crlf_idx = buf.find(b"\r\n")
        if crlf_idx == -1:
            return None, 0
        try:
            count = int(buf[1:crlf_idx])
        except ValueError:
            raise RespError("Protocol error: invalid array count")

        if count == -1:
            return None, crlf_idx + 2

        offset = crlf_idx + 2
        elements = []
        for _ in range(count):
            elem, consumed = parse_resp_stream(buf[offset:])
            if consumed == 0:
                # Incomplete child element
                return None, 0
            elements.append(elem)
            offset += consumed

        return elements, offset

    # Inline command fallback (e.g., telnet: "PING\r\n")
    crlf_idx = buf.find(b"\r\n")
    if crlf_idx != -1:
        line = buf[:crlf_idx].decode("utf-8", errors="replace").strip()
        parts = [p.encode("utf-8") for p in line.split()]
        return parts, crlf_idx + 2

    return None, 0
