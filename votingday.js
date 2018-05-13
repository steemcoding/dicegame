document.getElementById('myDate').valueAsDate = new Date();

function go(){
 var myId= document.getElementById("myId").value;

 steem.api.lookupAccounts(myId, 1, function(err, lookupAccounts) {
  if(myId!=lookupAccounts) alert('error ID');
  else myVoting(myId);
 });
}

function myVoting(myId) {

 var myDate = $("#myDate").val();
 var dt = new Date(myDate);
 var startDate = new Date(dt.setHours(dt.getHours() - 9)).toISOString().split('.')[0];
 var endDate = new Date(dt.setDate(dt.getDate()+1)).toISOString().split('.')[0];

 render(myId, startDate, endDate);
}

function render(author, startTime, endTime){
 steem.api.getAccountVotes(author, function(err, accountVotes) {
   // console.log(err, accountVotes);
  
  var cnt = 0;
  var output='<thead class="thead-dark"><th>ID</th><th>Post</th><th>KOREA TIME</th></tr></thead><tbody>';
  
  $('#output').html(output);
  for(d in accountVotes){
    if(accountVotes[d].time>=startTime && accountVotes[d].time<=endTime){
      var data = accountVotes[d].authorperm.split('/');
      var author = data[0];
      var permlink = data[1];
      var dt = new Date(accountVotes[d].time);
      var koreaTime = new Date(dt.setHours(dt.getHours() +18)).toISOString().split('.')[0];
      
      //보팅한 포스트
      votingpost(author, permlink,koreaTime);
      cnt+=1;
   }
  }
  var count = '<button type="button" class="btn btn-primary">Count <span class="badge badge-light">'+cnt+'</span><span class="sr-only">unread messages</span></button>'

  $('#count').html(count);
  $('#output').append('</tdoby>');

 });
 
 function votingpost(author, permlink,time){
   var query = {
   "limit": 1
   };
   query.tag = author;
   query.start_author = author;
   query.start_permlink = permlink;
   steem.api.getDiscussionsByBlog(query, function(err, discussionsByBlog) {
    //document.getElementById("post").innerHTML=discussionsByBlog[0].root_title;
    
    var output = '<tr><td>'+author+'</td><td>'+discussionsByBlog[0].root_title+'</td><td>'+time+'</td></tr>';
    
    $('#output').append(output);
   });
 }
}
