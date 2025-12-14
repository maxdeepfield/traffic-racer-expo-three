// Lane positions for 4-lane road
export const LANE_POSITIONS = [-3.5, -1.2, 1.2, 3.5] as const;
export const RIGHT_LANES = [1.2, 3.5] as const;
export const LEFT_LANES = [-3.5, -1.2] as const;

// Track settings
export const TRACK_LENGTH = 60;
export const TRACK_WIDTH = 10;
export const SEGMENTS_AHEAD = 8;
export const SEGMENTS_BEHIND = 2;

// Traffic settings
export const CAR_SPACING = 20;
export const CAR_COUNT = 14;
export const CAR_COLORS = [
  '#3366cc', '#33cc66', '#cc9933', '#9933cc',
  '#33cccc', '#666666', '#ffffff', '#cc6633'
] as const;

// Coin settings
export const COIN_SPACING = 20;
export const COIN_COUNT = 10;
export const ROAD_WIDTH = 10;
