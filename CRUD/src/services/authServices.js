
// Ambil user dari localStorage
export function getUsers(){
    const data = localStorage.getItem('users');
    if(!data) return [];
    try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Data users rusak:", error);
        return []; 
      }
}

// Simpan user ke localStorage
export function saveUsers(users){
    localStorage.setItem('users',JSON.stringify(users));
}

// Register
export function registerUsers(name, email, password){
    const users = getUsers();

    // Cek email yang sudah terdaftar
    const userExists = users.find((user) => user.email === email);
    if (userExists){
        throw new Error('Email sudah terdaftar!');
    }

    // untuk menambahkan user baru
    const newUser = { name, email, password};
    users.push(newUser);
    saveUsers(users);

    return newUser;
}

// Login
export function loginUser(email, password){
    const users = getUsers();
    const user = users.find(
        (user) => user.email === email
    );
    // jika email salah
    if(!user){
        throw new Error("Email belum terdaftar!");
    }
    // jika password salah
    if(user.password !==password){
        throw new Error("Password salah.")
    }
    
    //jika sukses simpan status login
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return user;
}

// Logout
export function logoutUser(){
    localStorage.removeItem('loggedInUser');
}

// Cek login
export function getLoggedInUser(){
    return JSON.parse(localStorage.getItem('loggedInUser'));
}
