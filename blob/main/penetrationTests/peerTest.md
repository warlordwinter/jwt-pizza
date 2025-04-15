# Penetration Testing

## Self Attack
## Aaron Onstott
| Item           | Result                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| Date           | 4/14/25                                                                       |
| Target         | pizza.aonstott329.click                                                       |
| Classification | Injection                                                                     |
| Severity       | 1                                                                             |
| Description    | SQL Injection can be performed when updating user to change or delete db data |
| Corrections    | sanitize user inputs                                                          |

| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.aonstott329.click                                |
| Classification | Broken access control                                  |
| Severity       | 3                                                      |
| Description    | allows registration of duplicate users with same email |
| Corrections    | Check if user already exists during registration       |

| Item           | Result                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------- |
| Date           | 4/14/25                                                                                  |
| Target         | pizza.aonstott329.click                                                                  |
| Classification | Broken access control                                                                    |
| Severity       | 2                                                                                        |
| Description    | admin account is vulnerable to dictionary attacks because of default password of "admin" |
| Corrections    | Change password to something more secure                                                 |

## Self Attack
## Wiley Welch
| Item           | Result                                  |
| -------------- | --------------------------------------- |
| Date           | April 14, 2025                          |
| Target         | pizza.pdfsimplifer.click                |
| Classification | Injection                               |
| Severity       | 3                                       |
| Description    | AuthToken Brute Force Pattern           |
| Images         | ![alt text](images/image.png) <br/>     |
| Corrections    | changed how to auth token pattern works |


| Item           | Result                                                    |
| -------------- | --------------------------------------------------------- |
| Date           | April 14, 2025                                            |
| Target         | pizza.pdfsimplifer.click                                  |
| Classification | Injection                                                 |
| Severity       | 1                                                         |
| Description    | SQL injection                                             |
| Code           | `sql DROP TABLE auth;`                                    |
| Corrections    | changed the string concationation to be less susceptiable |



## Peer Attack
## Aaron Onstott attacking Wiley
| Item           | Result                                            |
| -------------- | ------------------------------------------------- |
| Date           | 4/14/25                                           |
| Target         | pizza.pdfsimplifer.click                          |
| Classification | Broken access control                             |
| Severity       | 1                                                 |
| Description    | login system doesn't work, always gives 500 error |
| Corrections    | Fix 500 error to allow login                      |

| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.pdfsimplifer.click                               |
| Classification | Broken access control                                  |
| Severity       | 3                                                      |
| Description    | allows registration of duplicate users with same email |
| Corrections    | Check if user already exists during registration       |

## Wiley attacking Aaron
| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.aonstott329.click                               |
| Classification | Role Manipulation                                  |
| Severity       | 2                                                      |
| Description    | Try to create user with admin role directly.  |
| Result    | Failed  |
### Code
```sh
echo "Testing role manipulation..."
# Try to create user with admin role directly
admin_response=$(curl -s -X POST "$host/api/auth" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"HackerAdmin\", \"email\":\"hacker@jwt.com\", \"password\":\"hacker123\", \"roles\": [{\"role\": \"admin\"}]}")

echo "Role manipulation response: $admin_response"
```

| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.aonstott329.click                               |
| Classification | Token Manipulation                                  |
| Severity       | 2                                                      |
| Description    | Trying to get a token and manipulate it|
| Result    | Failed  |
### Code
```sh token=$(echo "$user_response" | jq -r '.token')
if [ -n "$token" ]; then
    # Try to use modified token
    echo "Testing modified token..."
    modified_token="${token}modified"
    response=$(curl -s -X GET "$host/api/order/menu" \
        -H "Authorization: Bearer $modified_token")
    echo "Modified token response: $response"
fi
```
| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.aonstott329.click                               |
| Classification | Injection                                  |
| Severity       | 2                                                      |
| Description    | Tried an SQL attack |
| Result    | Failed  |
### Code
```sh
echo "Testing input validation..."
# Try SQL injection in name
sql_injection_response=$(curl -s -X POST "$host/api/auth" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"'; DROP TABLE user; --\", \"email\":\"sql@jwt.com\", \"password\":\"sql123\"}")

echo "SQL injection response: $sql_injection_response"
```

| Item           | Result                                                 |
| -------------- | ------------------------------------------------------ |
| Date           | 4/14/25                                                |
| Target         | pizza.aonstott329.click                               |
| Classification | Injection                                  |
| Severity       | 2                                                      |
| Description    | Software Logging and Monitoring Failures |
| Result    | Failed  |
### Code
```sh
echo "Testing metrics and logging..."
# Try to inject malicious data that might be logged
malicious_response=$(curl -s -X POST "$host/api/auth" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"<script>alert(1)</script>\", \"email\":\"xss@jwt.com\", \"password\":\"xss123\"}")

echo "Malicious input response: $malicious_response"
```

# Combined Findings
We learned that cybersecurity isn't just protecting your stuff from getting deleted. It can be metrics security, it can be removing endpoints that isn't needed, it can also be ecripting your data and your student. 
To be a successful engineer its key for us to protect our system. Failing to do so breaks trust and stops customers and employees from trusting us.  It is also important to protect againt simple attacks, such as default admin passwords. It can be helpful to have other people try to find exploits in your code, because they might see things that you would not think of yourself.
