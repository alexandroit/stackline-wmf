/* Original API and action types (C) 2020-present SheetJS LLC; declarations packaged by Stackline. */
import type { Action } from "./actions";
export * from "./actions";
export function get_actions(data: Uint8Array | ArrayBuffer): Action[];
export function image_size(data: Uint8Array | ArrayBuffer): [number, number];
export function draw_canvas(data: Uint8Array | ArrayBuffer, image: HTMLCanvasElement): void;
export function render_canvas(actions: Action[], image: HTMLCanvasElement): void;
