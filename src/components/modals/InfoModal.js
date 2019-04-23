import React, { Component } from "react";

class InfoModal extends Component {
  render() {
    return (
      <div className="modalContainer">
        <div className="info-container">
          <div>
            <h2>Information</h2>
            <p>
              Mina aktier är en hemsida där du kan lägga till bevakningspost för
              aktier utan att använda riktiga pengar. Du kan också lägga till
              dina nuvarande aktieinnehav och se hur det går för dem. Om du
              istället vill använda sidan på flera enheter så kan du registrera
              ett konto och synka dina innehav.
            </p>
          </div>
          <div>
            <h2>Om att investera i värdepapper</h2>
            <p>
              Historisk avkastning är ingen garanti för framtida avkastning. En
              investering i värdepapper/fonder kan både öka och minska i värde
              och det är inte säkert att du får tillbaka det investerade
              kapitalet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              this.props.toggleInfoModal();
            }}
            className="btn btn_goBack"
          >
            Tillbaka
          </button>
        </div>
      </div>
    );
  }
}

export default InfoModal;
