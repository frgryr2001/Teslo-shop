import { UiState } from "./";

type UiActionType = { type: "[Ui] - ToggeMenu" };

export const uiReducer = (state: UiState, action: UiActionType) => {
  switch (action.type) {
    case "[Ui] - ToggeMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    default:
      return state;
  }
};
