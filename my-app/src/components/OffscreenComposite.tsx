import React, { forwardRef } from 'react';
import { View, Text, Image as RNImage } from 'react-native';

type Props = {
  uri: string;
  width: number;
  height: number;
  latitude: string;
  longitude: string;
  timestamp: string;
};

const OffscreenComposite = forwardRef<View, Props>(
  ({ uri, width, height, latitude, longitude, timestamp }, ref) => {
    const stripHeight = Math.max(48, Math.round(height * 0.08));
    const fontSize = Math.max(16, Math.round(stripHeight * 0.4));
    const label = `Lat: ${latitude}  Lon: ${longitude}  ${timestamp}`;

    return (
      <View ref={ref} style={{ width, height, backgroundColor: 'black' }}>
        <RNImage
          source={{ uri }}
          style={{ width, height, position: 'absolute' }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: stripHeight,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 16,
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'white', fontSize, fontWeight: '600' }} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </View>
    );
  }
);

export default OffscreenComposite;
