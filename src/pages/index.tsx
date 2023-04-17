import { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';

interface Skill {
  id: string;
  name: string;
  description: string;
}

interface User {
  person: {
    name: string;
    picture: string;
    headline: string;
  };
  strengths: Skill[];
}

interface Props {
  user?: User;
  error?: string;
}

export default function Home({ user, error }: Props) {
  const [username, setUsername] = useState('');
  const [userBio, setUserBio] = useState(user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get<User>(`https://torre.bio/api/bios/${username}`);
      setUserBio(response.data);
    } catch (error) {
      setUserBio(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border border-gray-400 p-2 rounded-md w-64"
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
          Search
        </button>
      </form>

      {error ? (
        <p>{error}</p>
      ) : userBio ? (
        <div className="max-w-md bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-4">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full mr-4"
                src={userBio.person.picture || 'https://via.placeholder.com/150'}
                alt=""
              />
              <div>
                <h1 className="text-lg font-bold">{userBio.person.name}</h1>
                <p className="text-gray-600">{userBio.person.headline}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            {userBio.strengths.map((skill) => (
              <div key={skill.id} className="mb-2">
                <h2 className="font-bold">{skill.name}</h2>
                <p>{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  try {
    const { data } = await axios.get<User>(`https://torre.bio/api/bios/${query.username}`);
    return { props: { user: data } };
  } catch (error) {
    return { props: { error: 'User not found' } };
  }
};