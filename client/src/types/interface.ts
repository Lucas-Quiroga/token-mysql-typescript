export default interface IregisterData {
    username: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
    gender: string;
}

export default interface Fields {
    [key: string]: string;
  }