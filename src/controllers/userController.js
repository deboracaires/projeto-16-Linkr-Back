import { userRepository } from "../repositories/userRepository.js";

export async function searchUsers(req, res) {
  try {
    const { name } = req.query

    const userList = await userRepository.searchBarFindUsers(name)

    res.send(userList.rows)

  } catch (error) {
    console.log(error)
    res.send(500)
  }
}

export async function getUserById(req, res) {
  try {
    const id = req.params.id;

    const user = await userRepository.getUserInfo(id)

    res.send(user)

  } catch (error) {
    console.log(error)
    res.send(500)
  }
}

export async function updateUser(req, res) {
  try {
    const { email, password, name, url } = req.body
    
    const id = res.locals.user.id

    if (email) {
      const user = await userRepository.verifyEmail(email)
      if (user && (user.id !== id)) return res.sendStatus(409)
    }
    const response = await userRepository.updateUserInfo(id, email, password, name, url)
    
    if (response) return res.sendStatus(204)
    
    return res.sendStatus(200)

  } catch(error) {
    console.log(error)
    return res.send(500)
  }
}