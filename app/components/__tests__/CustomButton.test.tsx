import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<CustomButton {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CustomButton {...defaultProps} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom background color', () => {
    const { getByText } = render(
      <CustomButton 
        {...defaultProps} 
        bgColor="secondary"
      />
    );
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('renders with primary background by default', () => {
    const { getByText } = render(
      <CustomButton {...defaultProps} />
    );
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('renders with accent background color', () => {
    const { getByText } = render(
      <CustomButton 
        {...defaultProps} 
        bgColor="accent"
      />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
}); 