#!/usr/bin/env python3
import os
import json
import re
from datetime import datetime

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
OUTPUT_DIR = os.path.join(ROOT_DIR, "assets", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "topics.json")

DOMAINS_CONFIG = [
    {
        "id": "01_core_foundations",
        "name": "Core Foundations",
        "icon": "🏗️",
        "color": "#22c55e",
        "badge": "Algorithms & Languages",
        "description": "Data structures, algorithms, CSES, Java internals, modern C++, and advanced SQL interview patterns."
    },
    {
        "id": "02_system_design",
        "name": "System Design",
        "icon": "🏛️",
        "color": "#3b82f6",
        "badge": "LLD & HLD",
        "description": "SOLID principles, GoF design patterns, production LLD case studies, and staff-level HLD architectures."
    },
    {
        "id": "03_systems_and_databases",
        "name": "Systems & Databases",
        "icon": "⚙️",
        "color": "#f59e0b",
        "badge": "OS, DBs & Distributed",
        "description": "Operating systems (OSTEP), computer networks, database internals, DDIA, and distributed consensus."
    },
    {
        "id": "04_infrastructure",
        "name": "Infrastructure",
        "icon": "🔧",
        "color": "#ef4444",
        "badge": "Tech Stack & Cloud",
        "description": "16 tech stack deep dives (Kafka, Redis, K8s, etc.), API security, and high-throughput data pipelines."
    }
]

CUSTOM_TOPIC_NAMES = {
    "dsa": "Data Structures & Algorithms",
    "cses": "CSES Problem Set Roadmap",
    "interviewbit": "InterviewBit Coding Mastery",
    "java": "Core Java & Memory Internals",
    "effective_java": "Effective Java (90 Items)",
    "java_concurrency_in_practice": "Java Concurrency in Practice",
    "c_programming_a_modern_approach": "C Programming: A Modern Approach",
    "cpp_programming_language": "The C++ Programming Language",
    "tour_of_cpp": "A Tour of C++",
    "effective_modern_cpp": "Effective Modern C++ (42 Items)",
    "cpp_concurrency_in_action": "C++ Concurrency in Action",
    "cpp_stl": "C++ Standard Template Library (STL)",
    "java_vs_cpp": "Java vs C++ Systems Mind Map",
    "sql": "FAANG Staff SQL Masterclass",
    "lld": "Low-Level System Design (LLD)",
    "hld": "High-Level System Design (HLD)",
    "system_design_interview": "Alex Xu System Design (Vol 1 & 2)",
    "fundamentals_of_software_architecture": "Fundamentals of Software Architecture",
    "monolith_to_microservices": "Monolith to Microservices (Sam Newman)",
    "ostep": "Operating Systems: Three Easy Pieces (OSTEP)",
    "uiuc_cs341_system_programming": "UIUC CS341 System Programming",
    "computer_networks": "Computer Networks (5-Layer Stack)",
    "database_system_concepts": "Database System Concepts (Silberschatz)",
    "database_internals": "Database Internals (Alex Petrov)",
    "ddia_book_study": "Designing Data-Intensive Applications (DDIA)",
    "distributed-systems": "Distributed Systems Theory & Consensus",
    "understanding_distributed_systems": "Understanding Distributed Systems (Vitillo)",
    "mit_6_5840_distributed_systems": "MIT 6.5840 Distributed Systems (6.824)",
    "stanford_cs244b_distributed_systems": "Stanford CS244B Advanced Distributed Systems",
    "cmu_15418_parallel_programming": "CMU 15-418 Parallel Computer Architecture",
    "stanford_ee382c_advanced_computer_architecture": "Stanford EE382C Advanced Computer Architecture",
    "mit_61060_performance_engineering": "MIT 6.1060 Performance Engineering (6.172)",
    "berkeley_cs267_parallel_computing": "UC Berkeley CS267 Parallel Computing",
    "information_retrieval_and_search_engines": "Information Retrieval & Search Engines",
    "relevant_search_solr_elasticsearch": "Relevant Search (Solr & Elasticsearch)",
    "lucene_in_action": "Lucene in Action",
    "minidb": "MiniDB (Rust Embedded Storage Engine)",
    "api_security_in_action": "API Security in Action (OAuth2 & Zero Trust)",
    "high_throughput_data_pipelines": "High-Throughput Data Pipelines",
    "tech-stack": "Infrastructure Tech-Stack Guides (16 Systems)"
}

IGNORED_DIRS = {".git", "target", "node_modules", "assets", "__pycache__", ".idea", ".vscode"}
IGNORED_FILES = {".DS_Store", "generate_site_data.py", "app.log", "async.log"}

def clean_name(folder_name):
    if folder_name in CUSTOM_TOPIC_NAMES:
        return CUSTOM_TOPIC_NAMES[folder_name]
    name = folder_name
    # Strip leading numbers like 01_, 02_
    name = re.sub(r'^\d+_', '', name)
    name = name.replace('_', ' ').replace('-', ' ')
    # Capitalize acronyms and words
    words = []
    acronyms = {'dsa', 'sql', 'db', 'api', 'hld', 'lld', 'io', 'nio', 'jvm', 'jmm', 'gc', 'oop', 'solid', 'gof', 'tsdb', 'lru', 'atm', 'kv', 'cap', 'p2p', 'dht', 'bft', 'simd', 'crc', 'arp', 'tcp', 'udp', 'ip', 'nat', 'bgp', 'ospf', 'sdn', 'wal', 'lsm', 'acid', 'mvcc', 'aries', '2pc', '3pc'}
    for w in name.split():
        if w.lower() in acronyms:
            words.append(w.upper())
        else:
            words.append(w.capitalize())
    return ' '.join(words)

def extract_desc_and_title(md_path):
    title = None
    desc = ""
    try:
        with open(md_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                stripped = line.strip()
                if not stripped:
                    continue
                if stripped.startswith('#') and not title:
                    title = re.sub(r'^#+\s*', '', stripped).strip()
                    continue
                if not desc and not stripped.startswith('#') and not stripped.startswith('```') and not stripped.startswith('!['):
                    # Clean markdown formatting
                    clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', stripped)
                    clean = re.sub(r'[\*\_`]', '', clean)
                    if len(clean) > 20:
                        desc = clean[:180] + ("..." if len(clean) > 180 else "")
                if title and desc:
                    break
    except Exception:
        pass
    return title, desc

def scan_folder(folder_path, rel_root):
    entries = []
    try:
        raw_entries = sorted(os.listdir(folder_path))
    except Exception:
        return [], []
    
    files = []
    subdirs = []
    
    for e in raw_entries:
        if e in IGNORED_FILES or e in IGNORED_DIRS or e.startswith('.'):
            continue
        full_p = os.path.join(folder_path, e)
        rel_p = os.path.relpath(full_p, rel_root)
        if os.path.isdir(full_p):
            subdirs.append((e, full_p, rel_p))
        elif os.path.isfile(full_p):
            ext = os.path.splitext(e)[1].lower().replace('.', '')
            size = os.path.getsize(full_p)
            files.append({
                "name": e,
                "path": rel_p,
                "ext": ext,
                "size": size
            })
    return files, subdirs

def build_topic_tree(topic_folder, rel_root):
    files, subdirs = scan_folder(topic_folder, rel_root)
    desc = ""
    readme_title = None
    readme_path = os.path.join(topic_folder, "README.md")
    if os.path.exists(readme_path):
        readme_title, desc = extract_desc_and_title(readme_path)
    elif files:
        for f in files:
            if f["ext"] == "md":
                readme_title, desc = extract_desc_and_title(os.path.join(rel_root, f["path"]))
                if desc:
                    break
                    
    subtopics = []
    total_files_count = len(files)
    
    for sub_name, sub_full, sub_rel in subdirs:
        sub_data = build_topic_tree(sub_full, rel_root)
        sub_data["id"] = sub_name
        sub_data["name"] = clean_name(sub_name)
        sub_data["path"] = sub_rel
        total_files_count += sub_data["fileCount"]
        subtopics.append(sub_data)
        
    return {
        "description": desc,
        "title": readme_title,
        "files": files,
        "subtopics": subtopics,
        "fileCount": total_files_count
    }

def collect_all_files(topic_node):
    all_files = list(topic_node.get("files", []))
    for sub in topic_node.get("subtopics", []):
        all_files.extend(collect_all_files(sub))
    return all_files

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    domains_data = []
    search_index = []
    
    total_files = 0
    total_md = 0
    total_java = 0
    total_sql = 0
    total_rs = 0
    total_topics_count = 0

    for dom_conf in DOMAINS_CONFIG:
        dom_dir = os.path.join(ROOT_DIR, dom_conf["id"])
        if not os.path.exists(dom_dir):
            continue
            
        topics = []
        raw_topics = sorted(os.listdir(dom_dir))
        for t_name in raw_topics:
            if t_name in IGNORED_DIRS or t_name in IGNORED_FILES or t_name.startswith('.'):
                continue
            t_full = os.path.join(dom_dir, t_name)
            if not os.path.isdir(t_full):
                continue
                
            t_rel = os.path.relpath(t_full, ROOT_DIR)
            topic_tree = build_topic_tree(t_full, ROOT_DIR)
            topic_tree["id"] = t_name
            topic_tree["name"] = clean_name(t_name)
            topic_tree["path"] = t_rel
            
            # File stats for this topic
            all_t_files = collect_all_files(topic_tree)
            ext_counts = {}
            for f in all_t_files:
                ext = f["ext"] or "other"
                ext_counts[ext] = ext_counts.get(ext, 0) + 1
            
            topic_tree["extCounts"] = ext_counts
            topic_tree["totalFiles"] = len(all_t_files)
            
            # Add to search index
            for f in all_t_files:
                t_ext = f["ext"]
                if t_ext in ['md', 'java', 'sql', 'rs', 'c', 'cpp', 'h']:
                    search_index.append({
                        "title": f["name"],
                        "path": f["path"],
                        "domain": dom_conf["name"],
                        "domainId": dom_conf["id"],
                        "topic": topic_tree["name"],
                        "topicPath": topic_tree["path"],
                        "ext": t_ext
                    })
            
            topics.append(topic_tree)
            total_topics_count += 1
            
        # Domain stats
        dom_files = []
        for t in topics:
            dom_files.extend(collect_all_files(t))
            
        domains_data.append({
            "id": dom_conf["id"],
            "name": dom_conf["name"],
            "icon": dom_conf["icon"],
            "color": dom_conf["color"],
            "badge": dom_conf["badge"],
            "description": dom_conf["description"],
            "topicCount": len(topics),
            "fileCount": len(dom_files),
            "topics": topics
        })

    # Also index top-level root markdown files
    for root_f in sorted(os.listdir(ROOT_DIR)):
        if root_f.endswith('.md') and not root_f.startswith('.'):
            full_p = os.path.join(ROOT_DIR, root_f)
            t_title, _ = extract_desc_and_title(full_p)
            search_index.append({
                "title": t_title or root_f,
                "path": root_f,
                "domain": "Curriculum & Overview",
                "domainId": "root",
                "topic": "Master Study Plan",
                "topicPath": root_f,
                "ext": "md"
            })

    # Global stats
    for item in search_index:
        ext = item.get("ext")
        total_files += 1
        if ext == "md":
            total_md += 1
        elif ext == "java":
            total_java += 1
        elif ext == "sql":
            total_sql += 1
        elif ext == "rs":
            total_rs += 1

    # Full 13-week master roadmap
    roadmap_data = [
        {
            "phase": 1,
            "name": "Phase 1: Core Foundations — Algorithms, Languages, Books & SQL",
            "weeks_span": "Weeks 1–4",
            "color": "#22c55e",
            "description": "Master algorithmic patterns, C/C++ memory models, Java internals, and staff-level FAANG SQL.",
            "weeks": [
                {
                    "week": 1,
                    "title": "Data Structures, Algorithms, CSES & C Programming",
                    "focus": [
                        "Arrays, Two Pointers, Sliding Window, Linked Lists, Stacks, Queues, Hashing",
                        "C Programming: Pointers, Arena Allocators, Fixed-Width Types, Storage Classes & Linking",
                        "Greedy Algorithms, Trie Autocomplete, Recursion & State-Space Backtracking",
                        "CSES Problem Set: Introductory, Sorting & Searching tracks"
                    ],
                    "deliverable": "Solve 20 classic medium/hard problem patterns and track CSES progress.",
                    "modules": [
                        {"name": "DSA Foundation Masterclasses", "path": "01_core_foundations/dsa"},
                        {"name": "CSES Problem Set Roadmap", "path": "01_core_foundations/cses"},
                        {"name": "C Programming: A Modern Approach", "path": "01_core_foundations/c_programming_a_modern_approach"},
                        {"name": "InterviewBit Coding Collection", "path": "01_core_foundations/interviewbit"}
                    ]
                },
                {
                    "week": 2,
                    "title": "Advanced Graph Algorithms, Dynamic Programming & CSES Mastery",
                    "focus": [
                        "BFS, DFS, Kahn's Topological Sort, Dijkstra, Bellman-Ford, Union-Find / DSU",
                        "1D & 2D Dynamic Programming (Knapsack, LCS, LIS, Interval DP)",
                        "Line Sweep Geometry & Interval Overlap Mechanics",
                        "CSES: Range Queries, Tree Algorithms, and Graph Algorithmic Tracks"
                    ],
                    "deliverable": "Complete graph traversal & DP state formulation exercises across DSA and CSES problem sets.",
                    "modules": [
                        {"name": "Graph Algorithms Masterclass", "path": "01_core_foundations/dsa/Graph-Algorithms-Masterclass"},
                        {"name": "Dynamic Programming Masterclass", "path": "01_core_foundations/dsa/dynamicprogramming"},
                        {"name": "Line Sweep Masterclass", "path": "01_core_foundations/dsa/linesweep"},
                        {"name": "CSES Range & Tree Algorithms", "path": "01_core_foundations/cses"}
                    ]
                },
                {
                    "week": 3,
                    "title": "Java Internals, Effective Java (90 Items), JCiP & FAANG SQL",
                    "focus": [
                        "Effective Java 3rd Edition: All 12 Chapters and 90 Items thoroughly internalized",
                        "Java Concurrency in Practice: Monitors, Volatile, JMM Happens-Before, AQS & CLH Queues",
                        "Modern Java 21+: Project Loom Virtual Threads, Carrier Threads, StructuredTaskScope",
                        "FAANG Staff SQL: Window Functions, Gaps & Islands, User Sessionization, Cohort Retention"
                    ],
                    "deliverable": "Review all 90 Effective Java items, master AQS & JMM mechanics, and solve 6 FAANG Staff SQL interview patterns.",
                    "modules": [
                        {"name": "Core Java & Memory Internals", "path": "01_core_foundations/java"},
                        {"name": "Effective Java (90 Items)", "path": "01_core_foundations/effective_java"},
                        {"name": "Java Concurrency in Practice", "path": "01_core_foundations/java_concurrency_in_practice"},
                        {"name": "FAANG Staff SQL Masterclass", "path": "01_core_foundations/sql"}
                    ]
                },
                {
                    "week": 4,
                    "title": "Advanced C++, STL & Modern Concurrency",
                    "focus": [
                        "The C++ Programming Language & Tour of C++: RAII, Move Semantics, Templates",
                        "Effective Modern C++: Smart Pointers, Universal References, Perfect Forwarding, Lambdas",
                        "C++ Concurrency in Action: std::thread, Lock-Free Atomics, Memory Orders (Acquire/Release)",
                        "Java vs C++ Mind Map: Side-by-side systems comparison (GC vs RAII, Generics vs Templates)"
                    ],
                    "deliverable": "Master C++ memory management, implement lock-free concurrency patterns, and contrast with JVM runtime.",
                    "modules": [
                        {"name": "The C++ Programming Language", "path": "01_core_foundations/cpp_programming_language"},
                        {"name": "Effective Modern C++", "path": "01_core_foundations/effective_modern_cpp"},
                        {"name": "C++ Concurrency in Action", "path": "01_core_foundations/cpp_concurrency_in_action"},
                        {"name": "C++ Standard Template Library (STL)", "path": "01_core_foundations/cpp_stl"},
                        {"name": "Java vs C++ Systems Mind Map", "path": "01_core_foundations/java_vs_cpp"}
                    ]
                }
            ]
        },
        {
            "phase": 2,
            "name": "Phase 2: System Design — Low-Level (LLD) & High-Level (HLD)",
            "weeks_span": "Weeks 5–8",
            "color": "#3b82f6",
            "description": "Object-oriented modeling, GoF patterns, 5 full LLD systems, and 28 Alex Xu HLD architectures.",
            "weeks": [
                {
                    "week": 5,
                    "title": "Object-Oriented Analysis, Design Principles & SOLID",
                    "focus": [
                        "SOLID Principles (Single Responsibility, Open/Closed, Liskov, ISP, Dependency Inversion)",
                        "Encapsulation, Polymorphism, and Composition vs Inheritance trade-offs",
                        "Class Diagrams, Sequence Diagrams, and UML Domain Modeling"
                    ],
                    "deliverable": "Diagram and code domain models for complex real-world entities.",
                    "modules": [
                        {"name": "LLD Foundations & SOLID", "path": "02_system_design/lld/01_foundations"},
                        {"name": "Low-Level Design Suite", "path": "02_system_design/lld"}
                    ]
                },
                {
                    "week": 6,
                    "title": "Gang of Four (GoF) Design Patterns in Practice",
                    "focus": [
                        "Creational: Singleton, Factory Method, Abstract Factory, Builder, Prototype",
                        "Structural: Adapter, Composite, Proxy, Decorator, Facade, Bridge, Flyweight",
                        "Behavioral: Strategy, Observer, Command, State, Chain of Resp, Mediator, Template"
                    ],
                    "deliverable": "Implement GoF design patterns in clean, production-grade Java without boilerplate.",
                    "modules": [
                        {"name": "GoF Design Patterns", "path": "02_system_design/lld/02_design_patterns"}
                    ]
                },
                {
                    "week": 7,
                    "title": "Low-Level System Design (LLD) Production Systems",
                    "focus": [
                        "Elevator System Design, LRU Cache, Parking Lot, Vending Machine, ATM System",
                        "Concurrency safety, thread-safe collections, lock granularities, and state transitions",
                        "9 1-Page PDF Quick Revision Cards for LLD interviews"
                    ],
                    "deliverable": "End-to-end implementation and test coverage of 5 full LLD interview systems.",
                    "modules": [
                        {"name": "LLD Case Studies & Implementations", "path": "02_system_design/lld/03_system_designs"}
                    ]
                },
                {
                    "week": 8,
                    "title": "High-Level System Design (HLD), Alex Xu, Architecture & Microservices",
                    "focus": [
                        "The 4-Step HLD Interview Framework: Scope, Availability Math, Capacity Math, 80/20 RAM sizing",
                        "Alex Xu Vol 1 & 2: Rate Limiter, Snowflake ID, TinyURL, Crawler, Chat, YouTube, Proximity, Disruptor",
                        "Fundamentals of Software Architecture: Instability (I), Distance from Main Sequence (D), ADRs",
                        "Monolith to Microservices (Sam Newman): Strangler Fig, Branch by Abstraction, CDC, Saga"
                    ],
                    "deliverable": "Master back-of-the-envelope calculations, architect 28 systems, and implement ArchUnit fitness functions.",
                    "modules": [
                        {"name": "High-Level System Design (HLD)", "path": "02_system_design/hld"},
                        {"name": "Alex Xu System Design (Vol 1 & 2)", "path": "02_system_design/system_design_interview"},
                        {"name": "Fundamentals of Software Architecture", "path": "02_system_design/fundamentals_of_software_architecture"},
                        {"name": "Monolith to Microservices", "path": "02_system_design/monolith_to_microservices"}
                    ]
                }
            ]
        },
        {
            "phase": 3,
            "name": "Phase 3: Systems, Networking, Database Engineering & Distributed Systems",
            "weeks_span": "Weeks 9–10",
            "color": "#f59e0b",
            "description": "Kernel syscalls, epoll, TCP/IP, B+ trees, LSM-trees, WAL, Raft consensus, and parallel computing.",
            "weeks": [
                {
                    "week": 9,
                    "title": "Operating Systems (OSTEP), UIUC CS341 & Computer Networks",
                    "focus": [
                        "OSTEP Virtualization: fork/exec, PCB, MLFQ 5 rules, Multi-Level Page Tables, TLB, Clock Page Faults",
                        "OSTEP Concurrency & Persistence: Futex locks, Condition Variables, VSFS, Inodes, WAL Journaling",
                        "Computer Networks: HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC, TCP 3-Way Handshake & BBR, CIDR, BGP, ARP",
                        "UIUC CS341 System Programming: POSIX sockets, epoll event loops, memory allocation"
                    ],
                    "deliverable": "Master kernel syscalls, LDE protocol, Linux epoll, TCP state machine, and BGP routing mechanics.",
                    "modules": [
                        {"name": "Operating Systems: Three Easy Pieces (OSTEP)", "path": "03_systems_and_databases/ostep"},
                        {"name": "UIUC CS341 System Programming", "path": "03_systems_and_databases/uiuc_cs341_system_programming"},
                        {"name": "Computer Networks (5-Layer Stack)", "path": "03_systems_and_databases/computer_networks"}
                    ]
                },
                {
                    "week": 10,
                    "title": "Database System Concepts, Database Internals, DDIA & Distributed Systems",
                    "focus": [
                        "Database System Concepts: Relational Algebra, BCNF Normalization, Volcano Iterator, ARIES Recovery",
                        "Database Internals (Alex Petrov): B-Link Trees, LSM SSTable compaction, Raft Consensus, 2PC/3PC",
                        "Designing Data-Intensive Applications (DDIA): Storage engines, encoding, replication, partitioning, batch/stream",
                        "Top-Tier University Papers: MIT 6.5840 (MapReduce, Raft), Stanford CS244B (DHT, BFT), CMU 15-418, Lucene"
                    ],
                    "deliverable": "Deep dive into ARIES 3-phase recovery, LSM compactions, Raft safety invariants, and Lucene inverted indexes.",
                    "modules": [
                        {"name": "Database System Concepts", "path": "03_systems_and_databases/database_system_concepts"},
                        {"name": "Database Internals (Alex Petrov)", "path": "03_systems_and_databases/database_internals"},
                        {"name": "Designing Data-Intensive Applications", "path": "03_systems_and_databases/ddia_book_study"},
                        {"name": "Distributed Systems Theory", "path": "03_systems_and_databases/distributed-systems"},
                        {"name": "MIT 6.5840 Distributed Systems", "path": "03_systems_and_databases/mit_6_5840_distributed_systems"},
                        {"name": "Stanford CS244B Distributed Systems", "path": "03_systems_and_databases/stanford_cs244b_distributed_systems"},
                        {"name": "Information Retrieval & Lucene", "path": "03_systems_and_databases/lucene_in_action"}
                    ]
                }
            ]
        },
        {
            "phase": 4,
            "name": "Phase 4: Infrastructure Tech-Stack, Security & High-Throughput Pipelines",
            "weeks_span": "Weeks 11–13",
            "color": "#ef4444",
            "description": "16 tech-stack production guides, OAuth2/OIDC zero-trust security, and stream processing architectures.",
            "weeks": [
                {
                    "week": 11,
                    "title": "Data Tier: Redis, Postgres, JDBC & Storage",
                    "focus": [
                        "Redis: Data structures, event loop, persistence (RDB/AOF), sentinel, cluster, memory eviction",
                        "Relational Databases & Postgres: MVCC, VACUUM, indexes (B-Tree, GIN, GiST), connection pooling (HikariCP)",
                        "JDBC Internals: Batch updates, transactions, fetch size, statement caching",
                        "Object Storage & Cassandra: S3 consistency models, Cassandra distributed partitioning and LSM storage"
                    ],
                    "deliverable": "Benchmark HikariCP pooling, design Cassandra partition keys, and configure Redis caching strategies.",
                    "modules": [
                        {"name": "Redis In-Memory Data Store", "path": "04_infrastructure/tech-stack/redis"},
                        {"name": "Relational Databases & Postgres", "path": "04_infrastructure/tech-stack/relational-databases"},
                        {"name": "JDBC Database Connectivity", "path": "04_infrastructure/tech-stack/jdbc"},
                        {"name": "Object Storage & S3", "path": "04_infrastructure/tech-stack/object-storage"},
                        {"name": "Apache Cassandra", "path": "04_infrastructure/tech-stack/cassandra"}
                    ]
                },
                {
                    "week": 12,
                    "title": "Streaming, Edge & Containers",
                    "focus": [
                        "Apache Kafka: Broker architecture, partitions, consumer groups, rebalancing, zero-copy, idempotence",
                        "Gateways, Proxies & Load Balancers: NGINX, HAProxy, Envoy, Envoy service mesh, L4 vs L7 routing",
                        "Docker & Containers: Namespaces (cgroups, pid, net), union filesystems (Overlay2), multistage builds",
                        "Kubernetes: Control plane (etcd, scheduler, kube-apiserver), Pod lifecycle, Services, Ingress, Deployments"
                    ],
                    "deliverable": "Architect an end-to-end event pipeline with Kafka, tune Envoy routing rules, and write production K8s manifests.",
                    "modules": [
                        {"name": "Apache Kafka Streaming Engine", "path": "04_infrastructure/tech-stack/kafka"},
                        {"name": "Gateways, Proxies & Load Balancers", "path": "04_infrastructure/tech-stack/gateways-proxies-loadbalancers"},
                        {"name": "Docker Container Internals", "path": "04_infrastructure/tech-stack/docker"},
                        {"name": "Kubernetes Production Orchestration", "path": "04_infrastructure/tech-stack/kubernetes"},
                        {"name": "Netty & Tomcat Runtimes", "path": "04_infrastructure/tech-stack/netty"}
                    ]
                },
                {
                    "week": 13,
                    "title": "API Security, Observability & High-Throughput Pipelines",
                    "focus": [
                        "API Security in Action: OAuth2 authorization framework, OIDC identity, JWT verification, mTLS, Zero Trust",
                        "Observability Stack: Grafana dashboards, Prometheus metrics TSDB, Splunk log aggregation, OpenTelemetry",
                        "High-Throughput Data Pipelines: Ingestion layers, Parquet/ORC columnar formats, Snappy/Zstandard, Exactly-Once",
                        "Spring Boot & Hibernate: Application context lifecycle, Hibernate 1st/2nd level cache, N+1 query problem"
                    ],
                    "deliverable": "Implement OAuth2 mTLS authorization server, build Grafana monitoring dashboard, and optimize pipeline throughput.",
                    "modules": [
                        {"name": "API Security in Action", "path": "04_infrastructure/api_security_in_action"},
                        {"name": "High-Throughput Data Pipelines", "path": "04_infrastructure/high_throughput_data_pipelines"},
                        {"name": "Grafana & Metrics Observability", "path": "04_infrastructure/tech-stack/grafana"},
                        {"name": "Splunk Enterprise Logging", "path": "04_infrastructure/tech-stack/splunk"},
                        {"name": "Spring Boot & Hibernate", "path": "04_infrastructure/tech-stack/spring-boot"}
                    ]
                }
            ]
        }
    ]

    output_payload = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "stats": {
            "totalFiles": total_files,
            "markdownFiles": total_md,
            "javaFiles": total_java,
            "sqlFiles": total_sql,
            "rustFiles": total_rs,
            "topics": total_topics_count,
            "weeks": 13,
            "domains": len(domains_data)
        },
        "domains": domains_data,
        "roadmap": roadmap_data,
        "searchIndex": search_index
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {OUTPUT_FILE}")
    print(f"📊 Stats: {total_md} docs, {total_java} java, {total_sql} sql, {total_rs} rs across {total_topics_count} topics and {len(domains_data)} domains.")

if __name__ == "__main__":
    main()
