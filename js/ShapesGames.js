// var colors=["red", "ForestGreen", "MediumBlue","orange","purple","DeepPink"];
	  var colors=["red", "ForestGreen", "MediumBlue","orange","purple"];
	  var ring_rad=[15,25,35,45,55];
	  var shapes=[];
	  var mistakes=0;
	  var score=0;
	  var canvas = document.getElementById('myCanvas');
	  var context = canvas.getContext('2d');
	  var Start=true;
	  var level=1; 
      var scoreLevels=[100,400, 1000, 2000, 3000];
	  var interv;

	  var swooshSound = new sound("sounds/menu-button-click-switch-01.mp3");
	  var mistakeSound = new sound("sounds/notification-alert-95.mp3");
	  var endOfGameSound = new sound("sounds/correct-answer-bell-gliss-01.mp3");
	  var newLevelSound = new sound("sounds/correct-answer-bell-gliss-04.mp3");	  
	  
	  function shape(ct_x, ct_y,type){
		this.type=type;
		if(type=="rectangle")
		{
	      var measures=[22,31 ];
	      var ind=Math.floor(Math.random() * 2);
	      this.width=measures[ind];
	      switch(ind){
		     case 0: 
		      this.height=measures[1];
		      break;
		     case 1: 
		      this.height=measures[0];
		      break;
		   		   
	       }
	      this.height=ind==0?measures[1]:measures[0]; 
		}
		else if(type=="circle")
			this.r=15;
		
	    this.ct_x=ct_x;
		this.ct_y=ct_y;
		var col_num=GetLevel(score)+2;
		var col_num=level<3?level+2:5;
		var ind=Math.floor(Math.random() * col_num);
		this.clr=colors[ind];
		
		if(type=="ring"){
			this.r=ring_rad[ind];
			this.ind=ind;
		}
	    this.growing=true;	  
	  }
	  
	   function redraw()
	  {
	     context.clearRect(0, 0, canvas.width, canvas.height);
         for (var i=0; i<shapes.length; i++)
    	  {
            context.beginPath();
			if (shapes[i].type=="circle")
               context.arc(shapes[i].ct_x, shapes[i].ct_y, shapes[i].r, 0, 2 * Math.PI, false);
		   else if (shapes[i].type=="rectangle")
			   context.rect( shapes[i].ct_x - shapes[i].width/2, shapes[i].ct_y-shapes[i].height/2, shapes[i].width, shapes[i].height );
    	    context.fillStyle = shapes[i].clr;
            context.fill();
    	   }  
     }
	 
	
	function ContinueGame(){
		
	  RemoveMessage();
	  var len=shapes.length;
	  shapes=shapes.splice(0,shapes.len);
	  redraw();
	}
	
	
	function GetLevel(score){
	  var len=scoreLevels.length;
      for (var i=0; i<len; i++)		
		if(score<scoreLevels[i])
			return i+1;	     
	  return len+1;		
	}
	
	function RemoveMessage()
	{		
	  messageContainer = document.querySelector(".game-message");
	  messageContainer.classList.remove("game-over");
      messageContainer.classList.remove("game-continue");  		
	}
	
 function sound(src) 
 {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
	{
		this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
 }