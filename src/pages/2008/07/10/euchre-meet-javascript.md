---
title: "Euchre, meet Javascript"
date: 2008-07-11
categories: 
  - "personal"
tags: 
  - "javascript"
---

Last summer my family got together for a nice weekend at the lake and planned on having a Euchre tournament since we are big on the game. I volunteered to throw together a nice little GUI to keep track of it all. I had it all planned out in my head and continually put it off until it was about an hour before we were going to start. After struggling with some initial associative arrays, I quickly ran to a pad and paper to get things organized. I vowed last July to put together something spectacular for the year to come and here it is next July and I am finally <a title="Round Robin Euchre Tournament Scorebord" href="http://maxbeatty.com/projects/RRETS.html" target="\_blank">finished</a>!

<!--more-->

So here's how I did it:

\[code lang=text\] var teams;

var initRound = 0;

var rounds = 0; // total to be defined later

function randOrd(){ return (Math.round(Math.random())-0.5); } \[/code\]

These are some globals that I reuse such as 'teams' which is the associative array that holds all the team info like name, players, record, and points. The 'initRound' is used to determine which round it is so I can do stuff like update the score, move completed rounds, and tell when the tournament is done. Obviously 'rounds' is how many rounds there will be and by my comment will be defined later. The `randOrd()` function I ripped from Google and is used to randomize the players into teams.

\[code lang=text\] function promptNumPlayers() { var numPlayers = 0; numPlayers = prompt("How many players?","(enter number here)");

if (numPlayers == null) { return; }

if(isNaN(parseInt(numPlayers)) || numPlayers < 0 || numPlayers == 0) { alert("Looking for a number here, chief! Try again!"); promptNumPlayers(); } else if(numPlayers % 2) { alert("Need even number of players for this Euchre tournament!"); promptNumPlayers(); } else { buildTeams(numPlayers); } } \[/code\]

This is what starts it all off - have to know how many players you're going to have! The check for 'null' sees if the user pressed 'Cancel' instead of 'OK'. This function loads every time the page does so if I or someone else doesn't want to go through the setup, this will stop it and just display the basics (good for testing CSS). Next, we see if the user tried to be smart and put "twelve" instead of "12" or something else that would crash the script. Since I don't know anyone with a robot that plays Euchre, I made them pick an even number so proper teams of two could be formed. Speaking of:

\[code lang=text\] function buildTeams(num) {

numTeams = (num / 2)

teams = new Array(numTeams);

players = new Array(num);

//build players list

for (i=0;i < num;i++) { players\[i\] = prompt("What is player #"+ (i+1) + "'s name?","(enter name here)"); if(players\[i\] == "" || players\[i\] == "(enter name here)") { alert("Please enter a proper name!"); players\[i\] = prompt("What is player #"+ (i+1) + "'s name?","(enter name here)"); } }

players.sort( randOrd ); // randomize players //build teams and stats

for (i= 0; i < numTeams; i++) { teams\[i\] = new Array(6); teams\[i\]\[0\] = (i+1); // team name teams\[i\]\[1\] = players.pop(); // teammate 1 teams\[i\]\[2\] = players.pop(); // teammate 2 teams\[i\]\[3\] = 0; // wins teams\[i\]\[4\] = 0; // losses teams\[i\]\[5\] = 0; // points total }

buildSchedule(teams);

displayTeams(); } \[/code\]

The number of players is divided by two to form those teams of two (Euchre is traditionally played with partners incase you didn't know). The 'teams' and 'players' arrays are set to proper length and then the prompting for player names begins. Again, more checking to make sure the user enters something besides blank or the standard filler text. Here's where that random function from earlier comes in handy. It jumbles the array so now I can go through in order and no one knows who will be on whose team. The 'teams' array is now built with team name, teammate 1, teammate 2, wins, losses, and point total. Time to build the round robin schedule!

\[code lang=text\] function buildSchedule(arr) { var len = arr.length;

if (len % 2) { //alert("Odd number of teams."); byeTeam = \["BYE","BYE","BYE",0,0,0\]; len = arr.push(byeTeam); }

rounds = len - 1;

var games = len / 2;

//alert("There are " + rounds + " rounds to play and there will be " + games + " games each round.");

var home = new Array(games);

var away = new Array(games);

//establish home and away

for (i = 0; i < games; i++) { home\[i\] = arr\[i\]\[0\]; away\[i\] = arr\[i + games\]\[0\]; }

away.reverse(); // creates first vs last ... middle vs middle matchups

for(r = 0; r < rounds; r++) { var txtNode = document.createTextNode("Round " + (r+1) + ":");

var roundNum = document.createElement('h5'); roundNum.appendChild(txtNode);

var roundDiv = document.createElement('div'); roundDiv.setAttribute('id', r); roundDiv.appendChild(roundNum); // print matchups

for (i=0;i < games; i++) { txtNode = document.createTextNode("Team " + away\[i\]); var spanA = document.createElement('span'); spanA.id = away\[i\]; spanA.appendChild(txtNode);

txtNode = document.createTextNode("Team " + home\[i\]); var spanH = document.createElement('span'); spanH.id = home\[i\]; spanH.appendChild(txtNode);

txtNode = document.createTextNode(" vs "); var matchup = document.createElement('p'); matchup.appendChild(spanA); matchup.appendChild(txtNode); matchup.appendChild(spanH);

roundDiv.appendChild(matchup); }

document.getElementById('schedule').appendChild(roundDiv);

//advance to next round

home.splice(1,0,away.shift());

away.push(home.pop());

} } \[/code\]

This part baffled me the most and made me do a little research into how <a title="Wiki: Round Robin Tournament" href="http://en.wikipedia.org/wiki/Round-robin\_tournament" target="\_blank">Round Robin Tournaments</a> were formed. This is also the first time I had played with the DOM using JavaScript. The '(len % 2)' uses the modulo to test if the number of teams is odd or even. Round Robin tournaments need an even number so if it is odd you have to add in BYE rounds (thus the pushing of fake team on array). The global 'rounds' from earlier is now definable along with how many games will be in each round.

Deciding how to form match-ups was another difficulty. I literally drew out tournaments and how they progressed and then switched to inserting them in Excel. Once I found a pattern I decided it would be easiest to split the teams into 'home' and 'away'. The first half of the teams would go to 'home' and the second half to 'away'. By reversing the 'away' array (say that 5 times fast), the first team in the 'teams' array would now face the last team instead of the middle team (important later). Now, we build some elements and append children. The for loop basically says, "I'm creating a span for the home and away team, placing the text 'Team' at the beginning and then assigning the id of the home and away team to the span." This id is actually the same id as the 'teams' array which will come in handy later when we are updating scores.

Based on what I found drawing out tournament rotations by hand, the first team would stay in a fixed position and all the other teams would rotate around it. To accomplish this, I first spliced in the last array element of 'away' after the first element of 'home' and then popped off the last element of 'home' and pushed it to the front of 'away'. So something like:

\[code lang=text\] <table> <tr> <td>1 vs 6</td> <td>1 vs 5</td> <td>1 vs 4</td> </tr> <tr> <td>2 vs 5</td> <td>6 vs 4</td> <td>5 vs 3</td> </tr> <tr> <td>3 vs 4</td> <td>2 vs 3</td> <td>6 vs 2</td> </tr> </table> \[/code\]

I was pretty proud I figured that out since I was always terrible with push, pop, and splice. Next is the easy part of displaying the teams in a scoreboard fashion:

\[code lang=text\] function displayTeams() {

var myTable = document.createElement('table');

var myTHEAD = document.createElement('thead');

var myTFOOT = document.createElement('tfoot');

var myTBODY = document.createElement('tbody');

var myRow = document.createElement('tr');

var theads = \["Team","Player 1","Player 2", "Won", "Loss","Points"\];

for (i=0;i<theads.length;i++) { txt = document.createTextNode(theads\[i\]); var myTH = document.createElement('th'); myTH.appendChild(txt); myRow.appendChild(myTH); }

myTHEAD.appendChild(myRow);

myTable.appendChild(myTHEAD);

txt = document.createTextNode("Results after " + initRound + " rounds.");

td = document.createElement('td'); td.colSpan = 6; td.appendChild(txt);

tr = document.createElement('tr');

tr.appendChild(td);

myTFOOT.appendChild(tr);

myTable.appendChild(myTFOOT);

for (var i= 0; i< teams.length; i++) {

arrRows = new Array(); //holds row info so then I can append in a loop arrRows.push(teams\[i\]\[0\]); // team number arrRows.push(teams\[i\]\[1\]); // player 1 arrRows.push(teams\[i\]\[2\]); // player 2 arrRows.push(teams\[i\]\[3\]); // wins arrRows.push(teams\[i\]\[4\]); // losses arrRows.push(teams\[i\]\[5\]); // points

myRow = document.createElement('tr');

if(arrRows\[0\] != "BYE") { for(j=0;j<arrRows.length;j++) { txt = document.createTextNode(arrRows\[j\]); myTD = document.createElement('td'); myTD.appendChild(txt); myRow.appendChild(myTD); } }

myTBODY.appendChild(myRow);

}

myTable.appendChild(myTBODY);

document.getElementById('scoreboard').appendChild(myTable);

updateForm();

} \[/code\]

Again, building elements at the DOM level, appending children, forming the table's head, etc. The footer was more to make sure it was actually updating but actually added a nice touch in the end. Loop through the teams, give each element a cell, tada! But wait, I don't care about that fake BYE team I had to throw in to make a schedule so don't print that. These last two functions took me the longest time and the most debugging:

\[code lang=text\] function updateForm() {

curRoundDiv = document.getElementById(initRound); scoringDiv = curRoundDiv.cloneNode(true); document.getElementById('curMatch').appendChild(scoringDiv);

points = document.createElement('select');

for(i=0;i<=13;i++) { opt = document.createElement('option'); optScore = document.createTextNode(i); opt.appendChild(optScore); points.appendChild(opt); }

spanAH = scoringDiv.getElementsByTagName('span');

for(i=0;i<spanAH.length;i++) { if(spanAH\[i\].id != "BYE") { PTS = points.cloneNode(true); PTS.id = spanAH\[i\].id; spanAH\[i\].appendChild(PTS); } } } \[/code\]

Pretty short, right? That 'initRound' comes in handy again! Pull whatever round it is, clone it and let's make it into an update form. Build simple 'selects' with 'options' to number from 0 to 13. Why 13? I thought Euchre games were played to 10? I'm not going to short change someone who goes alone after they're in the barn! Besides, points are the tie breaking mechanism in this beast so points need to be awarded where due. Still no love for the BYE team as they aren't awarded a 'select'. Now for makes this sucker run:

\[code lang=text\] function nextRound(form) {

var formSelects = form.getElementsByTagName('select');

//update W, L, point totals

for(i=0;i<formSelects.length;i++) { for(j=0;j<teams.length;j++) { //alert("team: " + teams\[j\]\[0\] + " | selectID: " + formSelects\[i\].id); if(teams\[j\]\[0\] == formSelects\[i\].id) { //alert("MATCH!"); teams\[j\]\[5\] += formSelects\[i\].selectedIndex;

if(formSelects\[i\].selectedIndex &gt;= 10) { //alert(teams\[j\]\[0\] + " team is winner!"); teams\[j\]\[3\] += 1; } else { //alert(teams\[j\]\[0\] + " team is loser!"); teams\[j\]\[4\] += 1; } } } }

var curRoundDiv = document.getElementById(initRound);

var spanAH = curRoundDiv.getElementsByTagName('span');

for(i=0;i<spanAH.length;i++) {

if(spanAH\[i\].id != "BYE") {

for(j=0;j<formSelects.length;j++) { //alert("spanID: " + spanAH\[i\].id + " | selectID: " + formSelects\[j\].id); if(formSelects\[j\].id == spanAH\[i\].id) { //alert("MATCH!"); txt = document.createTextNode(" Scored: " + formSelects\[j\].selectedIndex); spanAH\[i\].appendChild(txt); } } } }

document.getElementById('pastRounds').appendChild(curRoundDiv);

//remove old scoreboard d = document.getElementById('scoreboard'); t = d.getElementsByTagName('table'); d.removeChild(t\[0\]);

//remove old update form

d = document.getElementById('curMatch');

i = d.getElementsByTagName('div');

d.removeChild(i\[0\]);

initRound++;

if ( initRound == rounds) { te = teams.pop(); if(te\[0\] == "BYE") { //alert("ODD TEAMS"); for(i=0;i<teams.length;i++) { teams\[i\]\[4\] -= 1; //subtract loss from BYE rounds } }

displayTeams(); document.getElementById('updateForm').style.display = "none"; txt = document.createTextNode("Play Again?"); againBut = document.createElement('a'); againBut.setAttribute('href','JavaScript:location.reload(true);'); againBut.appendChild(txt); document.getElementById('schedule').appendChild(againBut); } else { displayTeams(); } } \[/code\]

Scary at first, I'll admit, but it's really just doing a lot and is pretty simple. First, find all the 'selects' we just inserted and loop through them for their 'selectedIndex' which also happens to be the score awarded (0,1,2,...). The 'selects' were sneakily given the same id as the spans from earlier. The spans have the same id as the teams so now these selects have the teams' id, too! This makes it easy to figure out what score goes to what team. I added some alerts during the debug process and now they are like nice comments. So the scores are updated in the 'teams' array, let's print the scores next to the team so we can review what each team got during each round. Wouldn't want the computer making a computational error! Next, let's move the played rounds to a new div called 'pastRounds'. It'll show the score and grey it out while allowing the next round to display at the top of the list and page. This was somewhat of a pain to figure out, but paid off as a great lesson manipulating the DOM with JavaScript.

After the small stuff, we need to update the big stuff like the scoreboard and update form. I thought it was easier to just delete the old stuff and rerun the functions I already had to build new ones. The 'initRound' is increased to say, "Next round!" and then checked to make sure it wasn't the last round. If it was NOT the last round the 'displayTeams()' is called, gets new data from 'teams' to display new scores, and then calls 'updateForm()' to print new 'selects' for the next round's match-ups.

If it is the last round, we remove the update form to signify no more scores will be accepted and add a link to Play Again (or refresh). I found out that BYE rounds resulted in the team in a BYE round receiving a loss so at the very end I go through and subtract a loss from everyone if there was a 'BYE' team in the 'teams' array. I wrote this explanation out in the footer so everyone can understand.

From there it's a matter of applying a little CSS and arranging the DIVs how you like. If you want to see that code just visit the page and view source. It's all there! I don't want every blog post to be this long, but I wanted to write this out so I at least knew what I did when/if I look back on this. If you think this could have been done any easier I'd love to hear it in the comments!
