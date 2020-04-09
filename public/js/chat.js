const socket=io();

//Elements
const $messageForm=document.querySelector('#message-form');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

//Options
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll=()=>{
    //New message element
    const $newMessage=$messages.lastElementChild;

    //New message element's height
    const newMessageStyles=getComputedStyle($newMessage);
    const newMessageMargin=parseInt(newMessageStyles.marginBottom);
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin;
    
    //Visible height
    const visibleHeight=$messages.offsetHeight;

    //Height of messages container
    const containerHeight=$messages.scrollHeight;
    
    //How far have i scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight;

    if(containerHeight-newMessageHeight<=scrollOffset)
    {
        $messages.scrollTop=$messages.scrollHeight;
    }
}

socket.on('message',(message)=>{
    console.log(message);
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html=Mustache.render(locationMessageTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    })
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('roomData',({users,room})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //Disabling button
    $messageFormButton.setAttribute('disabled','disabled');

    let message=e.target.elements.message.value;
    //Not letting the user send an empty message
    if(message=='')
    {   
        $messageFormButton.removeAttribute('disabled');
        return alert("Can't send an empty message!")
    }
   
    socket.emit('sendMessage',message,(error)=>{
        //Enabling button
        $messageFormButton.removeAttribute('disabled');

        //Clearing input field
        $messageFormInput.value='';

        //Bringing the focus back to the input  
        $messageFormInput.focus();

        if(error)
        {
            return console.log(error);
        }
        console.log('Message Delivered!');
    });
})
/*socket.on('countUpdated',(count)=>{
    console.log('Count has been updated',count);
})
document.querySelector('#increment').addEventListener('click',()=>{
    console.log('Clicked');
    socket.emit('increment');
})*/
$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser.');
    }
    $sendLocationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude        
        },()=>{
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error);
        location.href='/';
    }
});