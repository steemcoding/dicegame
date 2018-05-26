

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
  var dataset = [];
 
  for(d in accountVotes){
    if(accountVotes[d].time>=startTime && accountVotes[d].time<=endTime){
      var author = accountVotes[d].authorperm.split('/')[0];
                 
      //보팅한 카운트
      voterCount[author] = voterCount[author]?voterCount[author]+1:1;      
     
   }
  }
  //보팅 정렬
  votersort = Object.keys(voterCount).sort(function(a,b){return voterCount[b]-voterCount[a];});
  
  //보팅 name, voterCount 정보만 따로 변수에 저장
  for(k in votersort){
    dataset.push({Name: votersort[k], voterCount :voterCount[votersort[k]]});         
  }

  //결과를 원형 그래프로 시각화
  pie(dataset);
 });
}


function pie(data){    
    var width = 500, height = 500;
    var colorData=[];

    var pie = d3.pie();
    var pieData = pie(data.map(function(d) { return d.voterCount; }));
 
    for(var i in data){
    //  colorData[i]="#" + Math.floor(Math.random()*0xffffff).toString(16);
      colorData[i]="#" + Math.round(Math.random()*255).toString(16)+ Math.round(Math.random()*255).toString(16)+ Math.round(Math.random()*255).toString(16);  
    }

  
      var svg = d3.select('#svg').selectAll('svg').remove();
          svg = d3.select('#svg')
                .append("svg")
                .attr('width', width)
                .attr('height', height)                
                .style("background-color","#f0f0f0")
                .attr("id", "piegraph");                
    var arc = d3.arc().innerRadius(100).outerRadius(200);

    var g = svg.append('g').attr('transform', 'translate(250,250)');
        g.selectAll('path.slice')
           .data(pieData)
           .enter()
           .append('path')
           .classed('slice', true)
           .attr('d', arc)
           .attr('fill', function(d,i){ return colorData[i]; })
           .on("mouseover", function(d,i) {
               var output = '<button type="button" class="btn btn-primary">'+data[i].Name+'<span class="badge badge-light">'+data[i].voterCount+'</span><span class="sr-only">unread messages</span></button>'
               $('#output').html(output);        
            })
           .on("mouseout", function(d) {
               $('#output').html(''); 
            })        

        svg.append("text")
	 	       .attr("transform", "translate("+(width/2-70)+", "+(height/2+10)+")")
           .style("font-size","30px")           
	         .text("Count:" + d3.sum(data.map(function(d) { return d.voterCount; })));
};
 
 
