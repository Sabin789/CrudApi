document.addEventListener("click", function(x){
  if (x.target.classList.contains("edit")){
    let newName= prompt("New name")
    let newEmail= prompt("New Email")

    console.log(newName)
    axios.post("/update",{
      newName:newName,
      newEmail:newEmail,
      id: x.target.getAttribute("id"),
    })
    .then(function(){
      console.log("Succesful")
    })
    .catch(function(){
      console.log("Failed")
    })
  }
})
document.addEventListener("click", function(x){
  if (x.target.classList.contains("delete")){
    if(confirm('Do you really want to delete?')){
      axios.post("/delete",{
        id:x.target.getAttribute("id"),
      })
      .then(function(){
        console.log(`user with the name of ${user} delted`)
      }

    .catch(function(){
      console.log("Failed")

    }))
    }

  }})
