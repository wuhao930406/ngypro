import * as React from 'react';
export interface IWaterWaveProps {
  title: React.ReactNode;
  color?: string;
  height: number;
  percent: number;
  activepercent:number;
  style?: React.CSSProperties;
}

export default class WaterWave extends React.Component<IWaterWaveProps, any> {}
