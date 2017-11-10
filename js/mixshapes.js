
	  var best=localStorage.getItem("best-shapes");
	  document.getElementById('best-container').innerHTML=best;

	 function StartGame(){
		
	  RemoveMessage();
	  
      var len=shapes.length;
	  for(var i=0; i<len; i++)
		  shapes.pop();
		 
	  mistakes=0;
	  score=0;
	  level=1;
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
	  Start=true;	
	  context.clearRect(0, 0, canvas.width, canvas.height);		
	}

	
	  function draw()
	  {
         var growing = false;
         for (var i=0; i<shapes.length; i++)
    	 {
          if(shapes[i].growing)
		  {
			 if(!ShapeInsideCanvas(shapes[i],canvas))
			 {
    		    shapes[i].growing=false;
    		//    break;
    		 } 
    		 for (var j=0; j<shapes.length; j++ )
			 {
    		     if(i!=j && ShapesIntersect(shapes[i],shapes[j]))
				 {    
			 
					 if (shapes[i].clr===shapes[j].clr)// delete shapes if they are the same color
					 {
					    DrawShape(shapes[i]);
						DrawShape(shapes[j]);
						shapes.splice(i,1);
						if(i<j)
						  shapes.splice(j-1,1);
					    else
						  shapes.splice(j,1);
						redraw();
						swooshSound.play();
						return;
					 }
					 else
    			        shapes[i].growing=shapes[j].growing=false;
    			//	 break;  //contiue to search other shapes that touch shape i
    			 }
    			}
    		 if(shapes[i].growing)
			 {
				 if(shapes[i].type=="rectangle")
				 {
			       shapes[i].width*=1.025;
				   shapes[i].height*=1.025;
				 }
				 else
				   shapes[i].r=shapes[i].r+1;
    		    growing =true;
			 }
             DrawShape(shapes[i]);
    	   }
    	  }
         if (growing==false)
    	      clearInterval(interv);     
     }
	 
	  function StartShape(event){
	   if(!Start)
	      return;
	   swooshSound.play(); //without that doesn't work on mobile
	   swooshSound.stop();//
	   
	   var rect = canvas.getBoundingClientRect();
       var x=(event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
       var y= (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	   
	   if ((i=PointInsideShapes(x,y)) !=-1)   // regraw old rectangle
	   {
			shapes[i].growing=true;
			interv=setInterval(draw, 1000/30);
			return;
	   }
	   var type=["circle","rectangle"];
	   var ind=Math.floor(Math.random() * 2);
	   var s=new shape(x, y, type[ind]);
       	   
       if (!ShapeInsideCanvas(s,canvas) || ShapeIntersects(s) )
	   {
		    DrawMistake(s);
			mistakes++;
			if(mistakes<3)
			     mistakeSound.play();
			if (mistakes==3)
			{
			   Start=false;
			   clearInterval(interv);
			   endOfGameSound.play();
			   messageContainer = document.querySelector(".game-message");
			   messageContainer.classList.add("game-over");
			   messageContainer.getElementsByTagName("p")[0].textContent ="Game over!";
			}			
		    return;
	    }
					
	   mistakes=0;
	   redraw();
	   shapes.push(s);
	   clearInterval(interv);
	   interv=setInterval(draw, 1000/30);
	   score+=level;
	   var newlevel= GetLevel(score);
	   document.getElementById('score-container').innerHTML=score;
	 
	   if(score > best)
	   {
	     best=score;
	     document.getElementById('best-container').innerHTML= best;
		 window.localStorage.setItem("best-shapes", best)
		}
		if (newlevel>level){
			newLevelSound.play();
			level=newlevel;
			messageContainer = document.querySelector(".game-message");
            messageContainer.classList.add("game-continue");
			var txt = "Conratulations! You've reached level "+ level +" !"
            messageContainer.getElementsByTagName("p")[0].textContent =txt;
		}
	 }
	 
		 
	function ShapeInsideCanvas(shape,canvas){	
	  if(shape.type=="rectangle")
		  return RectangleInsideCanvas(shape,canvas);
	  else
		  return CircleInsideCanvas(shape,canvas)
	 }
	 
	 
	 function ShapeIntersects(sh){		 
	    for(var i=0; i<shapes.length; i++)
		{		
	        if(ShapesIntersect(sh, shapes[i]))
	           return true;
		}
	   return false;	  
	 }
	 
	 function ShapesIntersect(shape1, shape2)
	 {	
	    if(shape1.type==shape2.type )
		{
		  if(shape1.type=="circle")
		     return CirclesTouch(shape1, shape2)
		  else
		     return RectanglesTouch(shape1, shape2);
		}
	  
	  var circle=shape1.type=="circle"?shape1:shape2;
	  var rect=shape1.type=="circle"?shape2:shape1;
	  
	  var Distance_x = Math.abs(circle.ct_x - rect.ct_x);
      var Distance_y = Math.abs(circle.ct_y - rect.ct_y);

    if (Distance_x > rect.width/2 + circle.r)  return false; 
    if (Distance_y > rect.height/2 + circle.r)  return false; 
    if (Distance_x <= rect.width/2)	return true;
  	if (Distance_y <= rect.height/2)  return true; 
    var cornerDistance_sq = Math.pow(Distance_x - rect.width/2, 2) + Math.pow(Distance_y - rect.height/2, 2);

    return cornerDistance_sq  <= Math.pow(circle.r, 2);	  	  
}
	 
	 function DrawMistake(shape)
	 {	   
	   	 if(shape.type=="rectangle")
			 DrawMistakeRectangle(shape);
		 else
			 DrawMistakeCircle(shape);
	 }
	 
function PointInsideShapes(x,y){
	    for (i=0; i<shapes.length; i++)
		if(shapes[i].type=="rectangle")
		{
		  if( x > shapes[i].ct_x - shapes[i].width/2 && x <  shapes[i].ct_x + shapes[i].width/2 && y > shapes[i].ct_y - shapes[i].height/2 && y < shapes[i].ct_y + shapes[i].height/2 )
		      return i;
		}
		else{
			if( (x-shapes[i].ct_x)*(x-shapes[i].ct_x)+ (y-shapes[i].ct_y)*(y-shapes[i].ct_y) <  (shapes[i].r+3)*(shapes[i].r+3))
		      return i;
		}
		
	    return -1;
	 }	

function DrawShape(shape){
	if(shape.type=="rectangle")
			 DrawRectangle(shape);
		 else
			 DrawCircle(shape);
}   

