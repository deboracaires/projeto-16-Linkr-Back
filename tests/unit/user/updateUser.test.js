import { faker } from "@faker-js/faker";
import axios from 'axios'
import connection from '../../../src/database.js';

async function clearDatabase() {
  await connection.query('DELETE FROM "hashtagPost"');
  await connection.query('DELETE FROM "posts"');
  await connection.query('DELETE FROM "sessions"');
  await connection.query('DELETE FROM "users"');
}

async function closeConnection() {
  await connection.end();
}

async function createValidUser() {
    const user = {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        url: faker.internet.url()
    }
    return user
}

async function signUpFakeUser() {
    const user = await createValidUser()
    await axios.post('http://localhost:5000/signUp', user);
    return user
}
async function returnValidToken() {
    const user = await signUpFakeUser();

    const loginUser = await axios.post('http://localhost:5000/signin', {
        email: user.email,
        password: user.password
    });

    return loginUser.data.token
}

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeConnection();
});


describe('Atualização de usuário', () => {
    it('Deve atualizar o e-mail do usuário com sucesso', async () => {
        const token = await returnValidToken();

        const newFakeUser = await createValidUser()

        const updateResponse = await axios.put('http://localhost:5000/user', {email: newFakeUser.email}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expect(updateResponse.status).toBe(204);
    }),
    it('Deve atualizar a senha do usuário com sucesso', async () => {
        const token = await returnValidToken();

        const newFakeUser = await createValidUser()

        const updateResponse = await axios.put('http://localhost:5000/user', {password: newFakeUser.password}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expect(updateResponse.status).toBe(204);
    })
    it('Deve atualizar o nome do usuário com sucesso', async () => {
        const token = await returnValidToken();

        const newFakeUser = await createValidUser()

        const updateResponse = await axios.put('http://localhost:5000/user', {name: newFakeUser.name}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expect(updateResponse.status).toBe(204);
    })
    it('Deve atualizar a imagem do usuário com sucesso', async () => {
        const token = await returnValidToken();

        const newFakeUser = await createValidUser()

        const updateResponse = await axios.put('http://localhost:5000/user', {url: newFakeUser.url}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expect(updateResponse.status).toBe(204);
    })
    it('Deve retornar um erro se o e-mail fornecido já estiver cadastrado', async () => {
        const token = await returnValidToken();

        const newFakeUser = await signUpFakeUser()

        try {
            await axios.put('http://localhost:5000/user',
              { email: newFakeUser.email },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            expect(true).toBe(false);
          } catch (error) {
            expect(error.response.status).toBe(409);
          }
    })
    it('Deve atualizar todos os dados que o usuário enviar com sucesso', async () => {
        const token = await returnValidToken();

        const newFakeUser = await createValidUser()

        const updateResponse = await axios.put('http://localhost:5000/user', 
            {url: newFakeUser.url, email: newFakeUser.email, password: newFakeUser.password}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        expect(updateResponse.status).toBe(204);
    })
})