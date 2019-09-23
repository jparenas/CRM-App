import argon2 from "argon2";

const options = <argon2.Options>{
  type: argon2.argon2id
};

export async function hash(input: string): Promise<string> {
  return argon2.hash(input);
}

export async function verify(input: string, hashed: string): Promise<boolean> {
  return argon2.verify(hashed, input);
}
