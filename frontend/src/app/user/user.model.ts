export class User {
	public id: number;
	public email: string;
	public password: string;
	public name: string;
	public group_id: number;
	public waterschap_id: number;

	public static fromJSON(obj:any):User{
		let user:User = new User();
		user.id = obj.id;
		user.email = obj.email;
		user.password = obj.password;
		user.name = obj.name;
		user.group_id = obj.group_id;
		user.waterschap_id = obj.waterschap_id;
		return user;
	}
}
