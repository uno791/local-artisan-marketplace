export class User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;

  constructor({
    id,
    name,
    firstName,
    lastName,
    email,
    picture,
  }: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
  }) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.picture = picture;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
