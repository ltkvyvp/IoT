import {Position, Toaster} from "@blueprintjs/core";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  canEscapeKeyClear: true
});

export const MyToaster = (message, intent) => {
  AppToaster.show({
    message: message,
    intent: intent,
    timeout: 1500
  })
};
