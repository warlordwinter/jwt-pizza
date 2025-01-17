# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |  home.jsx,view.tsx      | None            |    None    |
| Register new user<br/>(t@jwt.com, pw: test)         |  register.jsx      |[Post]/api/auth    | INSERT INTO user (name, email, password) VALUES (?, ?, ?)<br/>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)             |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          |[Put]/api/auth                   | SELECT * FROM user WHERE email=? <br/> SELECT * FROM userRole WHERE userId=?<br/> INSERT INTO auth (token, userId) VALUES (?, ?)            |
| Order pizza                                         | delivery.tsx       | [Post]/api/order | INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())              |
| Verify pizza                                        | menu.tsx    | Sending it to Pizza factory    | None |
| View profile page                                   | dinnerDashboard.tsx    |  [Get]/api/order  |None              |
| View franchise<br/>(as diner)                       | frachiseDashboard.tsx  | [Get]/api/franchise/6 |SELECT id, name FROM franchise              |
| Logout                                              |    home.jsx         |  [Delete]api/auth | DELETE FROM auth WHERE token=? |
| View About page                                     |    about.tsx        | None              |      None    |
| View History page                                   |    history.tsx      | None              |  None        |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |frachiseDashboard.tsx| [Put]api/auth     |  INSERT INTO auth (token, userId) VALUES (?, ?)       |
| View franchise<br/>(as franchisee)                  | dinerDashboard.tsx  |[Get]/api/franchise/3 | None        |
| Create a store                                      | createstore.tsx     |[Post]api/franchise/1/store |   INSERT INTO store (franchiseId, name) VALUES (?, ?)           |
| Close a store                                       | closestore.tsx      | [Delete]api/franchise/1/store/2 |  DELETE FROM store WHERE franchiseId=? AND id=?            |
| Login as admin<br/>(a@jwt.com, pw: admin)           | adminDashboard.tsx  | [Put]api/auth |   INSERT INTO auth (token, userId) VALUES (?, ?)           |
| View Admin page                                     | adminDashBoard.tsx  | [Get]api/franchise | None          |
| Create a franchise for t@jwt.com                    | createFranchise.tsx |[Post]api/franchise  |  SELECT id, name FROM user WHERE email=?            |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx  | [Delete]api/franchise/3  |           await this.query(connection, `DELETE FROM store WHERE franchiseId=?`, [franchiseId]);
        await this.query(connection, `DELETE FROM userRole WHERE objectId=?`, [franchiseId]);
        await this.query(connection, `DELETE FROM franchise WHERE id=?`, [franchiseId]);           |
