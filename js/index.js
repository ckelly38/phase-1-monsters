function createMonster(event)
{
    //debugger;
    console.log("createMonster()!");
    event.preventDefault();
    console.log("default prevented!");
    console.log("event.target = " + event.target);
    console.log("event.target.length = " + event.target.length);
    let mynm = event.target[0].value;
    let myage = Number(event.target[1].value);
    let mydesc = event.target[2].value;
    let myagestr = "" + myage;
    console.log("mynm = " + mynm);
    console.log("myage = " + myage);
    console.log("mydesc = " + mydesc);

    if (mynm.length < 1 || mydesc.length < 1 || myagestr.length < 1 || myage < 0)
    {
        console.error("the name or the description was not valid!");
        alert("the name and the description and the age cannot be empty!");
        event.target[0].value = "";
        event.target[1].value = "";
        event.target[2].value = "";
        console.log("form reset!");
        return;
    }
    //else;//do nothing
    
    //add it on the server now
    const configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: "" + mynm,
          age: myage,
          description: mydesc
        }),
      };
      fetch("http://localhost:3000/monsters", configurationObject)
      .then((response) => response.json())
      .then(function dosomething(response){
        console.log("response = " + response);
        
        let mykids = document.getElementById("monster-container").children;
        console.log("mykids[mykids.length - 1] = " + mykids[mykids.length - 1]);
        
        mykids[mykids.length - 1].appendChild(getMonsterElementsAddToDOM(response.name,
            response.age, response.description));
        //debugger;
      })
      .catch(function (err) {
        console.error("failed to add it on the server!");  
        console.error(err);
        });
}

function setupForm()
{
    let myform = document.createElement("form");
    myform.name = "myform";
    myform.id = "myform";
    let myinptnm = document.createElement("input");
    myinptnm.name = "name";
    myinptnm.type = "text";
    myinptnm.placeholder = "name";
    let myinptage = document.createElement("input");
    myinptage.name = "age";
    myinptage.type="double";
    myinptage.placeholder = "age";
    let myinptdesc = document.createElement("input");
    myinptdesc.name = "desc";
    myinptdesc.type = "text";
    myinptdesc.placeholder = "decription";
    let myinptbutton = document.createElement("input");
    myinptbutton.name = "submit";
    myinptbutton.type = "submit";
    myinptbutton.id = "submitbtn";
    myform.appendChild(myinptnm);
    myform.appendChild(myinptage);
    myform.appendChild(myinptdesc);
    myform.appendChild(myinptbutton);
    document.getElementById("create-monster").appendChild(myform);

    document.getElementById("myform").
        addEventListener("submit", createMonster.bind(event));
}

//returns a div containing all of the data elements
//so all you need is append this to the DOM
function getMonsterElementsAddToDOM(name, age, desc)
{
    let mymn = document.createElement("h2");
    let myag = document.createElement("h4");
    let mydsc = document.createElement("p");
    mymn.textContent = "" + name;
    myag.textContent = "" + age;
    mydsc.textContent = "" + desc;
    let mydv = document.createElement("div");
    mydv.appendChild(mymn);
    mydv.appendChild(myag);
    mydv.appendChild(mydsc);
    return mydv;
}

let page = 1;
let maxpgnum = 1;
function getFirstFIFTYMonsters(pgnum)
{
    fetch("http://localhost:3000/monsters/?_limit=" + (pgnum * 50) + "&page=" + pgnum).
    then((response) => response.json()).
    then(function(response){
        console.log("response = " + response);
        let mymnstrs = response;
        let mydvfifty = document.createElement("div");
        for (let n = 50 * (pgnum - 1); n < mymnstrs.length; n++)
        {
            console.log("mymnstrs[" + n + "].name = " + mymnstrs[n].name);//h2
            console.log("mymnstrs[" + n + "].age = " + mymnstrs[n].age);//h4
            console.log("mymnstrs[" + n + "].description = " + mymnstrs[n].description);
            console.log("mymnstrs[" + n + "].id = " + mymnstrs[n].id);
            //p
            mydvfifty.appendChild(getMonsterElementsAddToDOM(mymnstrs[n].name,
                mymnstrs[n].age, mymnstrs[n].description));
        }//end of n for loop
        document.getElementById("monster-container").appendChild(mydvfifty);
        console.log("pgnum = " + pgnum);
        console.log("done loading the first 50 monsters!");
    })
    .catch(function(err)
    {
        console.error("there was a problem fetching the first 50 monsters!");
        console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", function(){
    getFirstFIFTYMonsters(page);
    setupForm();
    page++;

    document.getElementById("forward").addEventListener("click", function(){
        let mykids = document.getElementById("monster-container").children;
        const mylen = mykids.length;
        for (let n = 0; n < mylen; n++)
        {
            mykids[n].style.display = "none";
        }
        console.log("mykids.length = " + mykids.length);
        console.log("page = " + page);
        console.log("maxpgnum = " + maxpgnum);
        
        //debugger;
        if (mykids.length == page)
        {
            mykids[mykids.length - 1].style.display = "block";
        }
        else getFirstFIFTYMonsters(page);
        page++;
        if (maxpgnum < page) maxpgnum = page;//next page to display
    });
    document.getElementById("back").addEventListener("click", function(){
        let mykids = document.getElementById("monster-container").children;
        console.log("mykids.length = " + mykids.length);
        console.log("page = " + page);
        //when page is 2 there is only one page there

        if (page == 2)
        {
            console.error("cannot go below page 1!");
            return;
        }
        else if (page < 2) throw "page must be at least 2!";
        //else;//do nothing

        //hide the last page we were on
        //show the previous page
        mykids[page - 2].style.display = "none";
        mykids[page - 3].style.display = "block";
        
        console.log("maxpgnum = " + maxpgnum);//next page to display
        console.log("page = " + page);
        page--;
        console.log("NEW page = " + page);
        //debugger;
    });
});
