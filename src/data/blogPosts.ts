
export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  tags: string[];
  readTime: number;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "modern-cpp-best-practices",
    title: "Modern C++ Best Practices Every Developer Should Know",
    excerpt: "A comprehensive guide to writing clean, efficient, and maintainable C++ code using modern standards.",
    content: `
# Modern C++ Best Practices Every Developer Should Know

C++ has evolved significantly over the years, with C++11, C++14, C++17, and C++20 introducing many features that make the language more powerful, safer, and easier to use. In this article, I'll share some best practices that I've learned from my experience with modern C++ development.

[video](https://www.youtube.com/watch?v=dQw4w9WgXcQ) "Introduction to Modern C++ - YouTube Tutorial"

## Use Smart Pointers

Raw pointers in C++ can lead to memory leaks and other issues. Modern C++ provides smart pointers that help manage memory automatically:

\`\`\`cpp
// Avoid
int* rawPtr = new int(42);
// ...
delete rawPtr; // Easy to forget

// Prefer
std::unique_ptr<int> smartPtr = std::make_unique<int>(42);
// No need to manually delete
\`\`\`

## Embrace Move Semantics

Move semantics introduced in C++11 allow for more efficient resource management:

\`\`\`cpp
std::vector<int> createAndFill() {
    std::vector<int> result;
    // Fill the vector
    return result; // Implicitly moved
}

auto vec = createAndFill(); // No unnecessary copying
\`\`\`

[video](https://www.youtube.com/watch?v=IOkgBrXCtfo) "C++ Move Semantics Explained"

## Use auto for Type Inference

The \`auto\` keyword makes code more readable and maintainable:

\`\`\`cpp
// Without auto
std::map<std::string, std::vector<int>>::iterator it = myMap.begin();

// With auto
auto it = myMap.begin();
\`\`\`

## Prefer Range-Based For Loops

Range-based for loops are more concise and less error-prone:

\`\`\`cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// Old style
for (std::vector<int>::iterator it = numbers.begin(); it != numbers.end(); ++it) {
    // Use *it
}

// Modern style
for (const auto& num : numbers) {
    // Use num
}
\`\`\`

## Structured Bindings (C++17)

Structured bindings make working with pairs, tuples, and structured data more elegant:

\`\`\`cpp
std::map<std::string, int> myMap;
// ...
for (const auto& [key, value] : myMap) {
    std::cout << key << ": " << value << std::endl;
}
\`\`\`

## Use constexpr for Compile-Time Computation

\`constexpr\` allows for computation at compile time, which can improve performance:

\`\`\`cpp
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}

constexpr int result = factorial(5); // Computed at compile time
\`\`\`

## Conclusion

Modern C++ provides many tools and features that make code safer, more efficient, and easier to maintain. By adopting these best practices, you can write better C++ code and avoid common pitfalls.

Remember that mastering C++ is an ongoing journey, and staying updated with the latest standards and practices is key to becoming a proficient C++ developer.
    `,
    coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    publishedDate: "2023-03-15",
    tags: ["C++", "Programming", "Best Practices"],
    readTime: 8
  },
  {
    id: 2,
    slug: "in-memory-filesystem-implementation",
    title: "Building an In-Memory File System in C++",
    excerpt: "Learn how to design and implement a virtual file system from scratch with C++ and object-oriented principles.",
    content: `
# Building an In-Memory File System in C++

In this article, I'll walk through the process of designing and implementing a virtual file system in C++ that runs entirely in memory. This is a project I worked on that helped me deepen my understanding of file systems, object-oriented design, and memory management.

## Understanding File System Structure

Before diving into the implementation, it's important to understand the core components of a file system:

- **Inodes**: Data structures that store file metadata
- **Directory entries**: Mappings between file names and inodes
- **File content blocks**: Where the actual data is stored
- **Permissions system**: Controls who can access what

## Designing the Class Hierarchy

For our in-memory file system, we'll use a class hierarchy that models these components:

\`\`\`cpp
// Base class for all file system entries
class FSEntry {
protected:
    std::string name;
    mode_t permissions;
    uid_t owner;
    gid_t group;
    time_t accessTime;
    time_t modificationTime;

public:
    // Common operations
    virtual std::string getName() const;
    virtual void setPermissions(mode_t perms);
    // More methods...
};

// Represents a file
class File : public FSEntry {
private:
    std::vector<uint8_t> content;

public:
    void write(const std::vector<uint8_t>& data, size_t offset);
    std::vector<uint8_t> read(size_t offset, size_t size) const;
    // More methods...
};

// Represents a directory
class Directory : public FSEntry {
private:
    std::unordered_map<std::string, std::shared_ptr<FSEntry>> entries;

public:
    void addEntry(const std::string& name, std::shared_ptr<FSEntry> entry);
    std::shared_ptr<FSEntry> findEntry(const std::string& name) const;
    std::vector<std::string> listEntries() const;
    // More methods...
};
\`\`\`

## Implementing Shell Commands

With our core classes in place, we can implement shell-like commands:

\`\`\`cpp
class FileSystem {
private:
    std::shared_ptr<Directory> root;
    std::shared_ptr<Directory> currentDirectory;
    // More fields...

public:
    FileSystem() {
        root = std::make_shared<Directory>();
        currentDirectory = root;
    }

    void mkdir(const std::string& path) {
        // Implementation
    }

    void cd(const std::string& path) {
        // Implementation
    }

    void ls(const std::string& path = "") {
        // Implementation
    }

    void touch(const std::string& path) {
        // Implementation
    }

    void cat(const std::string& path) {
        // Implementation
    }

    // More commands...
};
\`\`\`

## Path Resolution

One of the trickier parts is resolving paths like \`/home/user/documents\`. Here's a simplified implementation:

\`\`\`cpp
std::shared_ptr<FSEntry> FileSystem::resolvePath(const std::string& path) {
    if (path.empty()) return currentDirectory;

    std::shared_ptr<Directory> startDir;
    if (path[0] == '/') {
        startDir = root;
    } else {
        startDir = currentDirectory;
    }

    // Split path by '/'
    std::vector<std::string> components = splitPath(path);
    
    std::shared_ptr<FSEntry> current = startDir;
    for (const auto& component : components) {
        if (component == "." || component.empty()) continue;
        if (component == "..") {
            // Handle parent directory
        } else {
            // Handle regular path component
            auto dir = std::dynamic_pointer_cast<Directory>(current);
            if (!dir) return nullptr; // Not a directory
            
            current = dir->findEntry(component);
            if (!current) return nullptr; // Not found
        }
    }
    return current;
}
\`\`\`

## Handling Permissions

A realistic file system needs to handle permissions. Here's an example:

\`\`\`cpp
bool FileSystem::checkPermission(std::shared_ptr<FSEntry> entry, Permission perm) {
    mode_t mode = entry->getPermissions();
    uid_t currentUser = getCurrentUser();
    gid_t currentGroup = getCurrentGroup();
    
    if (currentUser == 0) return true; // Root has all permissions
    
    if (entry->getOwner() == currentUser) {
        // Check owner permissions
        return mode & (perm << 6);
    } else if (entry->getGroup() == currentGroup) {
        // Check group permissions
        return mode & (perm << 3);
    } else {
        // Check other permissions
        return mode & perm;
    }
}
\`\`\`

## Conclusion

Building an in-memory file system is a fantastic exercise for understanding both file system concepts and object-oriented design in C++. The project can be extended with features like symbolic links, hard links, and even a simple journaling system for crash recovery.

This project taught me valuable lessons about memory management, resource ownership, and designing complex object hierarchies. I hope this overview inspires you to try implementing your own file system or similar system-level projects.
    `,
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop",
    publishedDate: "2023-05-20",
    tags: ["C++", "File Systems", "Object-Oriented Design"],
    readTime: 10
  },
  {
    id: 3,
    slug: "java-jdbc-best-practices",
    title: "JDBC Best Practices for Java Developers",
    excerpt: "Optimize your database operations in Java applications with these proven JDBC techniques and patterns.",
    content: `
# JDBC Best Practices for Java Developers

Java Database Connectivity (JDBC) is a core API for connecting Java applications to databases. While modern frameworks like Hibernate and Spring JPA have gained popularity, understanding JDBC fundamentals remains essential. In this article, I'll share best practices for efficient and clean JDBC code based on my experience developing database applications.

## Use Connection Pooling

Creating database connections is expensive. Connection pooling manages a set of reusable connections:

\`\`\`java
// Without connection pooling
for (int i = 0; i < 1000; i++) {
    Connection conn = DriverManager.getConnection(url, username, password);
    // Use connection
    conn.close(); // Expensive when done repeatedly
}

// With connection pooling (HikariCP example)
HikariConfig config = new HikariConfig();
config.setJdbcUrl(url);
config.setUsername(username);
config.setPassword(password);
HikariDataSource ds = new HikariDataSource(config);

for (int i = 0; i < 1000; i++) {
    Connection conn = ds.getConnection();
    // Use connection
    conn.close(); // Returns to pool, doesn't actually close
}
\`\`\`

## Always Use PreparedStatements

PreparedStatements protect against SQL injection and improve performance through statement caching:

\`\`\`java
// Vulnerable to SQL injection
String sql = "SELECT * FROM users WHERE username = '" + username + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);

// Safe and efficient
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);
ResultSet rs = pstmt.executeQuery();
\`\`\`

## Handle Resources Properly

Always close JDBC resources to prevent leaks, preferably with try-with-resources:

\`\`\`java
// Modern approach with try-with-resources
try (
    Connection conn = dataSource.getConnection();
    PreparedStatement pstmt = conn.prepareStatement(sql);
    ResultSet rs = pstmt.executeQuery()
) {
    while (rs.next()) {
        // Process results
    }
} catch (SQLException e) {
    // Handle exception
}
\`\`\`

## Use Batch Updates for Bulk Operations

When inserting multiple rows, use batch updates for better performance:

\`\`\`java
try (Connection conn = dataSource.getConnection()) {
    conn.setAutoCommit(false);
    try (PreparedStatement pstmt = conn.prepareStatement(
            "INSERT INTO products (name, price) VALUES (?, ?)")) {
        
        for (Product product : products) {
            pstmt.setString(1, product.getName());
            pstmt.setDouble(2, product.getPrice());
            pstmt.addBatch();
        }
        
        pstmt.executeBatch();
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}
\`\`\`

## Don't Reinvent the Wheel: Use a Simple Utility Class

Create utility methods to reduce boilerplate code:

\`\`\`java
public class DbUtils {
    public static void closeQuietly(AutoCloseable... resources) {
        for (AutoCloseable resource : resources) {
            if (resource != null) {
                try {
                    resource.close();
                } catch (Exception e) {
                    // Log but don't throw
                }
            }
        }
    }
    
    public static <T> List<T> queryForList(Connection conn, String sql, 
                                          RowMapper<T> mapper, Object... params) 
                                          throws SQLException {
        List<T> results = new ArrayList<>();
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) {
                pstmt.setObject(i + 1, params[i]);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    results.add(mapper.mapRow(rs));
                }
            }
        }
        return results;
    }
    
    // Other utility methods...
}

// Usage
List<Product> products = DbUtils.queryForList(conn, 
    "SELECT id, name, price FROM products WHERE category = ?", 
    rs -> new Product(rs.getLong("id"), rs.getString("name"), rs.getDouble("price")), 
    "Electronics");
\`\`\`

## Use Transactions for Data Integrity

Ensure operations that should be atomic are wrapped in transactions:

\`\`\`java
try (Connection conn = dataSource.getConnection()) {
    try {
        conn.setAutoCommit(false);
        
        // Multiple operations that need to happen together
        transferFunds(conn, fromAccount, toAccount, amount);
        logTransaction(conn, fromAccount, toAccount, amount);
        
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}
\`\`\`

## Conclusion

While modern ORM frameworks offer convenience, understanding JDBC fundamentals is crucial for Java developers working with databases. These best practices will help you write more efficient, secure, and maintainable database code, whether you're using plain JDBC or building custom data access layers.

By following these practices, you'll avoid common pitfalls like resource leaks, SQL injection vulnerabilities, and performance bottlenecks in your Java database applications.
    `,
    coverImage: "https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=2952&auto=format&fit=crop",
    publishedDate: "2023-07-10",
    tags: ["Java", "JDBC", "Database"],
    readTime: 7
  }
];
