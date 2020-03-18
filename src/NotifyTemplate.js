import notify from "devextreme/ui/notify";
//msg is any string
//type Accepted Values: 'custom' | 'error' | 'info' | 'success' | 'warning'
//time any time in ms
//template currently is not very flexible but if true it will add the icon to the text, can be enhanced to accept an obj with icon
//Error messages must be manually closed.
//Close by Swiping, Clicking outside notification, and Clicking on Icon in message.

export function notifyTemplate(
  message,
  type,
  time = 5000,
  template = false,
  position = "center",
  closeErrorFlag = false
) {
  // This is to simulate that the message stays until Manually Close
  if (!closeErrorFlag && type === "error") {
    time = 1000 * 60 * 60 * 24;
  }
  let notifyOptions = {
    closeOnSwipe: true,
    closeOnOutsideClick: true,
    contentTemplate: function(contentElement) {
      if (template) {
        let iconToUse = document.createElement("i");
        iconToUse.className = "fal fa-user-lock";
        let t = document.createTextNode(" icon at the top right of the screen");
        t.className = "dx-toast-message";
        document
          .getElementsByClassName("dx-toast-message")[0]
          .appendChild(iconToUse);
        document.getElementsByClassName("dx-toast-message")[0].appendChild(t);
      }
      contentElement.childNodes.forEach(node => {
        if (node.className.includes("dx-toast-icon")) {
          node.classList.add("notifyIconClick");
          node.onclick = () => {
            this.hide();
          };
        }
      });
    }
  };

  switch (position.toLowerCase()) {
    case "center":
      notifyOptions.position = { my: "center", at: "center", of: window };
      break;
    case "bottom":
      notifyOptions.position = {
        my: "bottom",
        at: "bottom",
        of: window,
        offset: "0, -15"
      };
      break;
    case "top":
      notifyOptions.position = {
        my: "top",
        at: "top",
        of: window,
        offset: "0, 20"
      };
      break;
    default:
      notifyOptions.position = { my: "center", at: "center", of: window };
      break;
  }

  notifyOptions["message"] = message;
  return notify(notifyOptions, type, time);
}
