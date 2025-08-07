import html2canvas from 'html2canvas';

const ExportCanvas=()=>{

    const exportCanvasToBase64 = async () => {
  const canvasElement = document.querySelector('.common-canvas-drop-div');

  if (!canvasElement) {
    return;
  }

  const canvas = await html2canvas(canvasElement);
  const base64Image = canvas.toDataURL('image/png');
  console.log('Base64 image:', base64Image);

  const a = document.createElement('a');
  a.href = base64Image;
  a.download = 'elyra-flowchart.png';
  a.click();
};
    return(
        <button onClick={exportCanvasToBase64}>Export as Image</button>

    )
}


export default ExportCanvas
