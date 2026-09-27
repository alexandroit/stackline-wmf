export interface Brush {
	/** Style (MS-WMF 2.1.1.4) */
	Style?: Number;
	/** Brush color RGB */
	Color?: number;
	/** Hatch Type (2.1.1.12 if brush is hatched) */
	Hatch?: number;
}

export interface Pen {
	Style?: number;
	Width?: number;
	Color?: number;
}

export interface Font {
	Name?: string;
	Height?: number;
	Italic?: boolean;
	Weight?: number;
	Angle?: number;
}

export interface PlaybackDeviceContextState {
	/** Mapping mode (MS-WMF 2.1.1.16) */
	MapMode?: number;
	/** Output window origin (X, Y) */
	Origin?: [number, number];
	/** Output window extents (X, Y) */
	Extent?: [number, number];
	/** Background Mix Mode (MS-WMF 2.1.1.20) */
	BkMode?: number;
	/** Polygon fill mode (MS-WMF 2.1.1.25) */
	PolyFillMode?: number;
	/** Bitmap stretching mode (MS-WMF 2.1.1.30) */
	StretchMode?: number;
	/** Text alignment mode (MS-WMF 2.1.2.3 / 2.1.2.4) */
	TextAlignmentMode?: number;
	/** Text foreground color RGB */
	TextColor?: number;
	/** Brush */
	Brush?: Brush;
	/** Font */
	Font?: Font;
	/** Pen */
	Pen?: Pen;
	/** Clipping Region (x,y) LT (x,y) RB */
	ClipRect?: [[number, number], [number, number]];
}

/** [x, y] */
export type Point = [ number, number ];

export interface ActionCommon {
	/** State */
	s?: PlaybackDeviceContextState;
}

/** Draw Text */
export interface ActionText extends ActionCommon {
	/** Action Type */
	t: "text";

	/** Text */
	v: string;

	/** Origin */
	p?: Point;
}

/** Draw Polygon (shape with stroke/fill) / Polyline (stroke only) */
export interface ActionPoly extends ActionCommon {
	/** Action Type */
	t: "poly";

	/** Points */
	p: Point[];

	/** Polygon (true) or Polyline (false) */
	g: boolean;
}

export interface ActionRaster {
	/** Raster Operaton 2.1.1.31 */
	rop?: number;
}

export interface ActionCpy extends ActionCommon, ActionRaster {
	t: "cpy";

	/** Source [[X, W], [Y, H]] */
	src: [[number, number], [number, number]];

	dst: Point;

	data?: any;
}

export interface ActionStr extends ActionCommon, ActionRaster {
	t: "str";

	/** Source [[X, W], [Y, H]] */
	src: [[number, number], [number, number]];

	/** Dest [[X, W], [Y, H]] */
	dst: [[number, number], [number, number]];

	data?: any;
}

export type Action = ActionText | ActionPoly | ActionCpy | ActionStr;

