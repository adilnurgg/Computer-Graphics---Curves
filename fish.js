 function setup() {"use strict";
          var canvas = document.getElementById('ocean');
          var context = canvas.getContext('2d');
          var slider1 = document.getElementById('slider1');
          var slider2 = document.getElementById('slider2');
          slider1.value = 10;
          slider2.value = 10;
          canvas.style.background = "#38afcd";
          function draw(){
          var tParam = 0;
          var velocity = ((slider1.value/10)) * 0.01;
          var thickness = slider2.value;
          
  
          function animate() {
            context.clearRect(0, 0, canvas.width, canvas.height);
           
            var curve_to_canvas = mat3.create();
            mat3.fromTranslation(curve_to_canvas,[0,350]);
	          mat3.scale(curve_to_canvas,curve_to_canvas,[100,-150]);

            context.setLineDash([thickness, 5]);
            drawTrajectory(0.0,1.0,100,C0,curve_to_canvas,"red");
	          drawTrajectory(0.0,1.0,100,C1,curve_to_canvas,"orange");
            drawTrajectory(0.0,1.0,100,C2,curve_to_canvas,"yellow");
            drawTrajectory(0.0,1.0,100,C3,curve_to_canvas,"green");
            drawTrajectory(0.0,1.0,100,C4,curve_to_canvas,"brown");

            var Tgreen_to_blue = mat3.create();
            mat3.fromTranslation(Tgreen_to_blue, Cf(tParam));
            var fish_to_canvas = mat3.create();
            mat3.multiply(fish_to_canvas, curve_to_canvas, Tgreen_to_blue);
            drawObject(fish_to_canvas);
            if (tParam > 5) {
              tParam = 0;
            } else {
              tParam += 1 * velocity;
            }
            window.requestAnimationFrame(animate);
          }
          
        var C0 = function(t) {return Cubic(Hermite,P0,t);};
        var C1 = function(t) {return Cubic(Hermite,P1,t);};
        var C2 = function(t) {return Cubic(Hermite,P2,t);};
        var C3 = function(t) {return Cubic(Hermite,P3,t);};
        var C4 = function(t) {return Cubic(Hermite,P4,t);};
          var Hermite = function(t) {
	          return [
              2*t*t*t-3*t*t+1,
              t*t*t-2*t*t+t,
              -2*t*t*t+3*t*t,
              t*t*t-t*t
            ];
          }

        function Cubic(basis,P,t){
            var b = basis(t);
            var result=vec2.create();
            vec2.scale(result,P[0],b[0]);
            vec2.scaleAndAdd(result,result,P[1],b[1]);
            vec2.scaleAndAdd(result,result,P[2],b[2]);
            vec2.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }
        var P0 = [[0,1],[1,1],[2,2],[3,-1]]; 
        var P1 = [[2,2],[3,-1],[4,1],[-1,3]]; 
        var P2 = [[4,1],[-1,3],[6,2],[2,-1]];
        var P3 = [[6,2],[2,-1],[8,0],[1,3]];
        var P4 = [[8,0],[1,3],[10,2],[2,-1]];


        var Cf = function(t) {
          if (t<1){
            return C0(t);
          } else if (t < 2) {
            return C1(t-1)
          } else if (t<3) {
            return C2(t-2)
          } else if (t<4) {
            return C3(t-3);
          } else {
            return C4(t-4);
          }
        }
        function drawObject(Tx) {
          drawBody(Tx);
          drawTopFin(Tx);
          drawSideFin(Tx);
          drawEye(Tx);
        }
        function drawBody(Tx){
          context.beginPath();
          context.fillStyle = "#52643f";
          moveToTx([-.1,-.1],Tx);
          lineToTx([.3,-.1],Tx);
          lineToTx([.5,0],Tx);
          lineToTx([.3,.1],Tx);
          lineToTx([-.1,.1],Tx);
          lineToTx([-.6,0],Tx);
          lineToTx([-.8,.1],Tx);
          lineToTx([-.7,0],Tx);
          lineToTx([-.8,-.1],Tx);
          lineToTx([-.6,0],Tx);
          context.closePath();
          context.fill(); 
        }
        function drawTopFin(Tx){
          context.beginPath();
          context.fillStyle = "#4e5a29";
          moveToTx([.2,.1],Tx);
          lineToTx([-.1,.2],Tx);
          lineToTx([.05,.1],Tx);
          context.closePath();
          context.fill();
        }
        function drawSideFin(Tx){
                    
          context.beginPath();
          context.fillStyle = "#4e5a29";
          moveToTx([.2,0],Tx);
          lineToTx([0,-.2],Tx);
          lineToTx([.1,0],Tx);
          context.closePath();
          context.fill(); 
        }
        function drawEye(Tx){
          context.beginPath();
          context.fillStyle = "rgba(239,68,85,.8)";
          arcToTx(.35, .05, 2, 0, 2 * Math.PI, Tx);
          context.fill();
        }
        function lineToTx(loc, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.lineTo(res[0], res[1]);
        }
        function moveToTx(loc, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.moveTo(res[0], res[1]);
        }
        
        function arcToTx(cx, cy, r, sr, er, Tx) {
          var res = vec2.create();
          vec2.transformMat3(res, [cx, cy], Tx);
          context.arc(res[0], res[1], r, sr, er);
        }

        function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {
          context.strokeStyle = color;
	        context.beginPath();
          moveToTx(C(t_begin),Tx);
          for(var i = 1; i <= intervals; i++) {
		        var t = ((intervals-i)/intervals) * t_begin + (i/intervals) * t_end;
		        lineToTx(C(t),Tx);
          }
          context.stroke();
        }
        
        animate();
      }  
      slider1.addEventListener("input",draw);
      slider2.addEventListener("input",draw);
      draw();
      }
        

      window.onload = setup;