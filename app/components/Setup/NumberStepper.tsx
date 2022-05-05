import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';

const NumberStepper: React.FC<{
  setValue: (val: number) => void;
  value: number;
}> = ({ setValue, value }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    defaultValue: value,
    min: -10,
    max: 40,
    onChange: (val) => setValue(parseInt(val, 10)),
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW="320px">
      <Button {...dec}>-</Button>
      <Input {...input} />
      <Button {...inc}>+</Button>
    </HStack>
  );
};

export default NumberStepper;
