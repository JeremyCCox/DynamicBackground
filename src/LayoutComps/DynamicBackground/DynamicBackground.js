import styled from "styled-components";
import pano from '../../static/panorama.jpg';
import pano1 from '../../static/calgaryPano.jpg'
import pano2 from '../../static/panorama.jpg'
import pano3 from '../../static/awful.jpg'
import PositionButton from "./PositionButton";
import {useEffect, useReducer, useRef, useState} from "react";
import RequestOverlay from "./RequestOverlay";


const BackgroundStyle = styled.div.attrs(props=>({
    style: {
        backgroundPositionX: props.middle + "%",
    },
}))`
  background-image: url(${props=> props.image}); // Reads prop from BackgroundStyle Component, Image is passed from array of imported images.
  background-repeat: repeat;
  background-size: cover;
`
const PositionControls = styled.div`
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

// useReducer is like useState but also allows defining functions for re-use.
function posReducer(state,action){
    switch (action.type){
        case("increment"): // Basic Increment function. Used by the Right arrow.
            if(state <= 99 && state >= 0){
                return (state +.8)
            }
            if(state > 100 || state < 0 ){
                return 0
            }
            return 100

        case("decrement"):// Basic Decrement function. Used by the left arrow.
            if(state >= 1 && state <= 100){
                return (state -.8)
            }
            if(state > 100 || state < 0 ){
                return 100
            }
            return 0
        case("incrementLoop"): // Increment loop function. Used by the Right arrow on 360 photos.
            return (state +.8)
        case("decrementLoop"): // Decrement loop function. Used by the Left arrow.
            return (state -.8)
        case("scroll"): // Basic Scroll function. Only adds action.speed as speed can be negative. Positive = Increment | Negative = Decrement
            if(state+ action.speed <= 100 && state+ action.speed >= 0){
                return(state + action.speed)
            }
            if(state+ action.speed >= 100){
                return 100
            }
            if(state+ action.speed < 0){
                return 0
            }
            return 50
        case("scrollLoop"): // Scroll loop function for 360 photos. Only adds action.speed as speed can be negative. Positive = Increment | Negative = Decrement.
            return(state + action.speed)
        case("drag"): // Basic Drag function. Only adds action.speed as speed can be negative. Positive = Increment | Negative = Decrement.
            if(state+ action.speed <= 100 && state+ action.speed >= 0){ //  Scroll speed SHOULD be calculated with Math.log10(Math.log(Math.abs(e.clientX-dragStart.x)))
                return(state + action.speed)
            }
            if(state+ action.speed >= 100){
                return 100
            }
            if(state+ action.speed < 0){
                return 0
            }
            return 50
        case("dragLoop"):// Drag loop function. Only adds action.speed as speed can be negative. Positive = Increment | Negative = Decrement.
            return (state +action.speed)
        case("reset"): // Centers image. Called when background image is changed.
            return 50
        case("stopEvent"):
            return false;
        case("startEvent"):
            return true;
    }
}

function DynamicBackground(){
    const [adjustPos,dispatchAdjustPos] = useReducer(posReducer, 50); // useReducer -> Easier way to do repetitive state processes. https://react.dev/reference/react/useReducer
    const [dragStart,setDragStart] = useState();
    const [repeatEvent, setRepeatEvent] = useState() // Initializes as undefined (as to not run constantly)
    const [backgroundImage, setBackgroundImage] = useState("1")
    const [allowLoop,setAllowLoop]=useState("")
    const [mouseMoveEvent,setMouseMoveEvent] = useState(false);
    const [displayOverlay,setDisplayOverlay]=useState(true)


    window.addEventListener('keyup',handleKeyDown, {once:true}); // Sets escape listener
    function handleKeyDown(e){
        if(e.key !== 'Escape'){
            return ;
        }
        clearInterval(repeatEvent) // Clears the interval for Hover element.
        setDisplayOverlay(true) // Triggers display Overlay
        setMouseMoveEvent(false) // Disables moveMouse event, using the useEffect cleanup pattern
    }

    const handleHover=(type)=>{
        setRepeatEvent(setInterval(()=>{
            dispatchAdjustPos({type:type})
        },
            20))
    }
    const exitHover = ()=>{
        clearInterval(repeatEvent)
    }

    const scrollPage=(e)=>{
        dispatchAdjustPos({type:"scroll"+allowLoop,speed:e.deltaY/100})
    }


    const startDragPage=(e)=>{
        setDragStart({x:e.clientX,y:e.clientY})
        setMouseMoveEvent(true)
    }

    const dragPage=(e)=>{
        let num = Math.abs(e.clientX-dragStart.x)
        if(e.clientX-dragStart.x < 0){
            dispatchAdjustPos({type:"drag"+allowLoop,speed:-1*Math.log10(Math.log(Math.abs(e.clientX-dragStart.x)))})
        }else{
            dispatchAdjustPos({type:"drag"+allowLoop,speed:Math.log10(Math.log(Math.abs(e.clientX-dragStart.x)))})
        }
        // console.log(Math.log10(e.clientY-dragStart.y))
    }

    const stopDragPage=()=>{
        // clearInterval(repeatEvent)
        setMouseMoveEvent(false)
    }
    const changeBackground=(imageNum)=>{+
        setBackgroundImage(imageNum)
        if(imageNum==="3"){
            setAllowLoop("Loop")
        }else{
            setAllowLoop("")
        }

    }
    // Simple boolean toggle. True=Overlay false=Functional Overlay (Escape & listeners)
    const toggleOverlay=()=>{
        setDisplayOverlay(prevState => !prevState)
    }
    // Effect to ensure each background starts in the middle
    useEffect(()=>{
        dispatchAdjustPos({type:"reset"})
    },[backgroundImage])

    useEffect(()=>{ // useEffect cleanup pattern. Calls on mouseMoveEvent change (True/False)
        if(mouseMoveEvent){ // If mouseMoveEvent set to true:
            window.addEventListener('mousemove',dragPage,true) // Add 'mousemove' listener to window, call dragPage and "Capture = true" (disables passthrough)
        }
        return()=>{ // This cleans up any old event listener. Saves from conflicts that can lead to multiple mousemove listeners clogging the process.
            window.removeEventListener('mousemove',dragPage,true)// Remove 'mousemove' listener from window. Needs to match the listener above exactly.
        }
    },[mouseMoveEvent]) // Dependency array. What the effect is "listening" to. Changing value calls method above.

    let images = [pano,pano1,pano2,pano3] // This is a list of photos. Photos must be imported at the top of the file. This is the only way to display images while using styled.components.
    return(
        <BackgroundStyle middle={adjustPos} image={images[backgroundImage]} > {/* The background holding DIV. backgroundImage = int/string in the range of images length */}
            <RequestOverlay display={displayOverlay} toggleDisplay={toggleOverlay} mousemoving={mouseMoveEvent} setBackground={changeBackground} message={"Click to unlock scroll function"}>
                <PositionControls onWheel={scrollPage} onMouseDown={startDragPage} onMouseUp={stopDragPage} >
                    <PositionButton handleHover={handleHover} handleExit={exitHover} type={"decrement"+allowLoop}>&#8249;</PositionButton>
                    <PositionButton handleHover={handleHover} handleExit={exitHover} type={"increment"+allowLoop}>&#8250;</PositionButton>
                </PositionControls>
            </RequestOverlay>
        </BackgroundStyle>
    )


}
export default DynamicBackground;