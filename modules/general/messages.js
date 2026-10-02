/*
iframe {
  position: fixed; /* Stays in the top-right even when scrolling. Use 'absolute' if you want it to scroll with the page. 
  top: 0;
  right: 0;
  width: 300px;    /* Adjust size as needed 
  height: 200px;   /* Adjust size as needed 
  z-index: 9999;   /* Ensures it stays on top of other content 
  border: none;    /* Removes the default border 
}
style='position:fixed;top:0;right:0;width:512px;height:384px;
*/
export function addFrame(){
    return "<iframe style='position:fixed;top:0;right:0;width:512px;height:384px;' src='/messages.html'></iframe>"
}