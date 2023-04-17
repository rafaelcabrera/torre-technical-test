export interface UserBio {
    person: {
      name: string;
      picture: string | null;
      headline: string;
    };
    strengths: Skill[];
  }
  
  export interface Skill {
    id: string;
    code: string;
    name: string;
    experience: string;
  }