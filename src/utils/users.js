let users=[];
 
const addUser=({id,username,room})=>{
    //Clean the data
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    //Validate Data
    if(!room || !username)
    {
        return {
            error:'Username and room are required!'
        }
    }

    //Checking for existing user
    const existingUser=users.find((user)=>{
        return user.username===username && user.room===room;
    })

    //Validate username
    if(existingUser)
    {
        return {
            error:'Username is in use!'
        }
    }

    //Storing User
    const user={username,id,room};
    users.push(user);
    return {user};
}
 
//Testing addUser function
/*console.log(addUser({
    id:123,
    username:'Sarthak',
    room:'123'
}))
console.log(addUser({
    id:123,
    username:'Sarthak',
    room:'123'
}))
console.log(users)*/

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id;
    })
    
    if(index!=-1)
    {
        return users.splice(index,1)[0]
    }
}

//Testing removeUser function
/*console.log(addUser({
    id:123,
    username:'sarthak',
    room:'22'
}));
console.log(removeUser(123))
console.log(users)*/

const getUser=(id)=>{
    return users.find((user)=>{
        if(user.id===id)
        {
            return user;
        }
    })
}

const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase();
    let newa=[];
    users.find((user)=>{
        if(user.room===room)
        {
            newa.push(user)
        }
    })
    return newa;
}

//Testing the getUser function and the getUsersInRoom function
/*console.log(addUser({
    id:123,
    username:'sarthak',
    room:'22'
}));
console.log(addUser({
    id:14,
    username:'Gupta',
    room:'23'
}));
console.log(addUser({
    id:189,
    username:'Rohan',
    room:'22'
}));
console.log(users)
//console.log(getUser(14))
console.log(getUsersInRoom('22'))*/

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}