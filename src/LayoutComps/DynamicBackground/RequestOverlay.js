import styled from "styled-components";

const Overlay=styled.div`
  height: 100vh;
  width: 100%;
  background-color: rgba(128,128,128,.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: xxx-large;
`
const OverlayButtons = styled.div`
  margin: unset;
  padding: 30px;
  text-align: center;
  align-self: flex-start;
  position: fixed;
  display: flex;
  justify-content: space-around;
  width: 40%;
  &>input{ // Styling input elements
    padding: 20px;
    background-color: rgba(255, 51, 204,0.5);
    color:white;
  }
`
const OverlayMessage = styled.p` // Not currently used, displays a message positioned on screen.
  margin: unset;
  padding: 30px;
  text-align: center;
  position: fixed;
`

const FunctionalOverlay=styled.div`
  height: 100vh;
  cursor: ${props=> props.mouseMoving?"move":"default"}}
`
const EscapeLabel = styled.label`
  color:whitesmoke;
  opacity: 50%;
  margin: unset;
  padding: 30px;
  text-align: center;
  position: fixed;
`


function RequestOverlay(props){
//Setting local variable to property passed from parent. Uses default value assigned if property is not passed, or passed property is undefined.
    let {message = "No message given!",display=true, toggleDisplay= ()=>{}, mousemoving=false} = props
    // Reads ID to determine which background to display. setBackground is a placeholder function until background image can be set dynamically.
    const setBackground=(e)=>{
        props.setBackground(e.target.id)
    }

    //Reads display prop. If true, displays the menu Overlay. If false displays functional Overlay, with props.children (nested XML elements) containing the positional inputs.
    if(display){
        return(
            <Overlay onClick={toggleDisplay}>
                <OverlayButtons> 
                    <input type={"button"} value={"Calgary Skyline"} id={"1"} onClick={setBackground}/> {/*Background one (Calgary Skyline)*/}
                    {/*<input type={"button"} value={"Calgary Skyline"} id={"2"} onClick={setBackground}/>*/} {/*Background two (Copyright image. Im no pirate)*/}
                    <input type={"button"} value={"My office"} id={"3"} onClick={setBackground}/> {/*Background three (360 office image)*/}
                </OverlayButtons>
                {message} {/* message property*/}
            </Overlay>
        )
    }else{ // Display is false 
        return (
            <>
                <FunctionalOverlay mouseMoving={mousemoving} >
                    <EscapeLabel>
                        [ ESC ] to exit
                        <input type={"button"} hidden={true} onClick={toggleDisplay}/>
                    </EscapeLabel>
                    {props.children}
                </FunctionalOverlay>
            </>
        )

    }

}export default RequestOverlay; // Export the function as default Component (for import)