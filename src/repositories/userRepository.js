import connection from "../database.js"
import bcrypt from 'bcrypt';

async function searchBarFindUsers(query) {
  return connection.query(`

    SELECT id, name, picture FROM users
      WHERE name ILIKE $1
  `, [`%${query}%`])
}

async function getUserInfo(id) {
  const users = await connection.query(`SELECT * FROM users WHERE id=$1`, [id]);

  const user = users.rows[0];

  delete user.passwordHash

  return user

}

async function verifyEmail(email) {
  const user = await connection.query(`SELECT * FROM users WHERE email = $1`, [email])
  return user.rows[0]
}


async function updateUserInfo(id, email, password, name, url) {
  const updates = {};

  if (email) {
    updates.email = email;
  }

  if (password) {
    const passwordHash = bcrypt.hashSync(password, 10);
    updates[`"passwordHash"`] = passwordHash;
  }

  if (name) {
    updates.name = name;
  }

  if (url) {
    updates.picture = url;
  }

  if (Object.keys(updates).length === 0) {
    return false; // Nenhum campo a ser atualizado
  }

  const updateFields = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const params = Object.values(updates);
  params.push(id);

  const updateQuery = `
    UPDATE users
    SET ${updateFields}
    WHERE id = $${params.length}
    RETURNING *;`;

  await connection.query(updateQuery, params);
  return true;
}

export const userRepository = {

  searchBarFindUsers,
  getUserInfo,
  updateUserInfo,
  verifyEmail
}