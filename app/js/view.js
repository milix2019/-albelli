export const initView = () => {
  document.body.innerHTML = `
<div class="mainContainer">
  <div grid-area: header>
    <div class="title">
      <div class="moveButtons">
        <div class="triangleUp" id="btnMoveDown"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        <div class="triangleBottom" id="btnMoveUp"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
        <div class="triangleLeft" id="btnMoveRight"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
        <div class="triangleRight" id="btnMoveLeft"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>
      </div>
      <h1>Simple Example</h1>
    </div>
    <form class="tollblarForm" action="#">
      <div>
        <label for="scaleImage">Scale</label>
        <input type="button" value="50%" id="btnScale50" />
        <input type="button" value="100%" id="btnScale100" />
        <input type="button" value="200%" id="btnScale200" />
      </div>
      <div>
        <input type="file" id="fileSelector" />
      </div>
      <div>
      <label for="save">Save Img Config</label>
        <input type="button" value="save" id="btnSave" />
      </div>
    </form>
  </div>
  <div grid-area: main>
    <canvas id="editorCanvas"></canvas>
  </div>
</div>`;
};
