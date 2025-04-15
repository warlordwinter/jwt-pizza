# Penetration Testing

## Self Attack

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

## Peer Attack

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
