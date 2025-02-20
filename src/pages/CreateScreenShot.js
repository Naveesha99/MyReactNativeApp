import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const CreateScreenShot = ({ 
  playerName, 
  score, 
  backgroundImage,
  onShare 
}) => {
  const viewShotRef = useRef();

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to storage to save the screenshot.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const shareScore = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          console.error('Storage permission denied');
          return;
        }
      }
  
      // Capture the view as an image
      const uri = await viewShotRef.current.capture();
  
      const shareOptions = {
        title: 'Game Score',
        message: `Check out my score! ${playerName}: ${score}`,
        url: uri, // Use the captured image
        type: 'image/png',
      };
  
      await Share.open(shareOptions);
  
      if (onShare) {
        onShare('success');
      }
  
      // Clean up temporary file (for Android)
      if (Platform.OS === 'android') {
        try {
          await RNFS.unlink(uri);
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (onShare) {
        onShare('error');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 1.0,
          result: 'data-uri'
        }}
        style={styles.viewShot}
      >
        <Image
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.playerName}>{playerName}</Text>
          <Text style={styles.score}>{score}</Text>
        </View>
      </ViewShot>

      <TouchableOpacity 
        style={styles.shareButton}
        onPress={shareScore}
      >
        <Text style={styles.shareButtonText}>Share Score</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  viewShot: {
    width: 300, 
    height: 400,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  score: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#4267B2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateScreenShot;