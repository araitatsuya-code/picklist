import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import welcomeImage from '../../assets/onboarding/welcome.png';

const WelcomePage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={welcomeImage} style={styles.image} resizeMode="cover" />
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: colors.background.primary + '80',
            },
          ]}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Picklistへようこそ
        </Text>
        <Text style={[styles.description, { color: colors.text.primary }]}>
          買い物リストを簡単に管理できる{'\n'}
          あなたの買い物アシスタント
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default WelcomePage;
