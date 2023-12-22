import styled from "styled-components";

const PositionLabel = styled.label`
  padding: 30px;
  color:white;
  font-size: xxx-large;
  margin: 20px;
  z-index: ;
  &:hover{
    //border: 0px solid black;
    box-shadow: 0px 0px  0px 8px rgba(0,0,0,0.5);
  }
`

// Position button component, 
function PositionButton(props){
    let {type = "reset"} =props;

    // Calls handleHover function with type property, type property is used by reducer function to determine operation.
    const mouseEvent=(e)=>{
        props.handleHover(type);
    }


    return(
        <PositionLabel onMouseEnter={mouseEvent}  onMouseOut={props.handleExit}>
            {props.children}
            <input type={"button"}  hidden={true} />
        </PositionLabel>
    )
}export default PositionButton; // export Component as default.