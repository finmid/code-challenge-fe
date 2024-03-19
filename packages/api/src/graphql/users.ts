import users from "src/data/users.json";

export const getUsers = (smeId?: string) => {
    return users
        .filter((user) => user.smeId === smeId)
        .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
        }));
}