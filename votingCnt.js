
document.getElementById('myDate1').valueAsDate = new Date();
document.getElementById('myDate2').valueAsDate = new Date();

function go(){
 var myId=  $("#myId").val();
 steem.api.lookupAccounts(myId, 1, function(err, lookupAccounts) {
  if(myId!=lookupAccounts) alert('error ID');
  else myVoting(myId);
 });
}

function myVoting(myId) {

 var myDate1 = $("#myDate1").val();
 var myDate2 = $("#myDate2").val();
 
 var dt = new Date(myDate1);
 var startDate = new Date(dt.setHours(dt.getHours() - 9)).toISOString().split('.')[0];
 dt = new Date(myDate2); 
 var endDate = new Date(dt.setHours(dt.getHours() + 15)).toISOString().split('.')[0];

 render(myId, startDate, endDate);
}

function render(author, startTime, endTime){
 steem.api.getAccountVotes(author, function(err, accountVotes) {
   // console.log(err, accountVotes);
  
  var voterCount={};
  var votersort=[];
  var cnt = 0;
  var output='<thead class="thead-dark"><tr><th>ID</th><th>VOTING COUNT</th></tr></thead><tbody>';
  
 
  for(d in accountVotes){
    if(accountVotes[d].time>=startTime && accountVotes[d].time<=endTime){
      var author = accountVotes[d].authorperm.split('/')[0];
                 
      //보팅한 카운트
      voterCount[author] = voterCount[author]?voterCount[author]+1:1;      
      //전체 카운트
      cnt+=1;
   }
  }

  votersort = Object.keys(voterCount).sort(function(a,b){return voterCount[b]-voterCount[a];});
  for(k in votersort){
   output += '<tr><td>'+votersort[k]+'</td><td>'+voterCount[votersort[k]]+'</td></tr>';   
  }
  output +='</tdoby>';
  $('#output').html(output);

  var count = '<button type="button" class="btn btn-primary">Count <span class="badge badge-light">'+cnt+'</span><span class="sr-only">unread messages</span></button>'
  $('#count').html(count); 

 });
}
