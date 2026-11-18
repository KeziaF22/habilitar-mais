import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import InstructorSignupScreen from '../InstructorSignupScreen';

jest.mock('lucide-react-native', () => new Proxy({}, { get: () => () => null }));

let screen;
let onComplete;
const text = () => screen.root.findAllByType(Text).map(node => node.props.children).flat().join(' ');
const fill = (placeholder, value) => act(() => {
  screen.root.findByProps({ placeholder }).props.onChangeText(value);
});
const press = async (label) => {
  const button = screen.root.findAllByType(TouchableOpacity).find(node =>
    node.findAllByType(Text).some(child => child.props.children === label));
  expect(button).toBeDefined();
  await act(async () => { await button.props.onPress(); });
};
const fillAccount = () => {
  fill('Digite seu nome completo', 'Maria Silva');
  fill('000.000.000-00', '52998224725');
  fill('seu@email.com', 'maria@example.com');
  fill('Mínimo 8 caracteres', 'senha1234');
  fill('Repita a senha', 'senha1234');
};

beforeEach(() => {
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  onComplete = jest.fn().mockResolvedValue(undefined);
  act(() => { screen = renderer.create(<InstructorSignupScreen onComplete={onComplete} />); });
});
afterEach(() => {
  act(() => screen.unmount());
  jest.restoreAllMocks();
});

it('cria a conta em duas etapas usando somente os campos essenciais', async () => {
  expect(text()).toContain('1/2');
  expect(screen.root.findAllByType(TextInput)).toHaveLength(5);
  fillAccount();
  await press('Próximo: Aulas');
  expect(text()).toContain('2/2');
  fill('Ex: Manaus', 'Manaus');
  await press('Carro (B)');
  fill('Ex: Honda, Toyota, Volkswagen', 'Honda');
  fill('Ex: Fit, Corolla, Gol', 'Fit');
  await press('Manual');
  fill('Ex: 50', '75,50');
  await press('Finalizar Cadastro');
  expect(onComplete).toHaveBeenCalledWith({
    name: 'Maria Silva', cpf: '52998224725', email: 'maria@example.com',
    password: 'senha1234', city: 'Manaus', vehicleType: 'Carro', brand: 'Honda',
    carModel: 'Fit', transmission: 'Manual', pricePerHour: '75,50',
  });
});

it('preserva os dados ao voltar e impede CPF e e-mail inválidos', async () => {
  fillAccount();
  fill('000.000.000-00', '11111111111');
  await press('Próximo: Aulas');
  expect(text()).toContain('1/2');
  fill('000.000.000-00', '52998224725');
  fill('seu@email.com', 'invalido');
  await press('Próximo: Aulas');
  expect(Alert.alert).toHaveBeenCalledWith('E-mail inválido', expect.any(String));
  fill('seu@email.com', 'maria@example.com');
  await press('Próximo: Aulas');
  const back = screen.root.findByProps({ accessibilityLabel: 'Voltar' });
  act(() => back.props.onPress());
  expect(screen.root.findByProps({ placeholder: 'Digite seu nome completo' }).props.value).toBe('Maria Silva');
});

it('exige veículo, cidade e preço válido antes de enviar', async () => {
  fillAccount();
  await press('Próximo: Aulas');
  await press('Finalizar Cadastro');
  expect(onComplete).not.toHaveBeenCalled();
  fill('Ex: Manaus', 'Manaus');
  await press('Carro (B)');
  fill('Ex: Honda, Toyota, Volkswagen', 'Honda');
  fill('Ex: Fit, Corolla, Gol', 'Fit');
  await press('Manual');
  for (const value of ['49', 'abc', 'Infinity', '75abc']) {
    fill('Ex: 50', value);
    await press('Finalizar Cadastro');
  }
  expect(onComplete).not.toHaveBeenCalled();
  fill('Ex: 50', '50');
  onComplete.mockRejectedValueOnce(new Error('Falha de gravação'));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  await press('Finalizar Cadastro');
  expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
  expect(screen.root.findAllByType(TouchableOpacity).find(node =>
    node.findAllByType(Text).some(child => child.props.children === 'Finalizar Cadastro')).props.disabled).toBe(false);
});

it('bloqueia novo envio e retorno enquanto salva o cadastro', async () => {
  fillAccount();
  await press('Próximo: Aulas');
  fill('Ex: Manaus', 'Manaus');
  await press('Moto (A)');
  fill('Ex: Honda, Toyota, Volkswagen', 'Honda');
  fill('Ex: Fit, Corolla, Gol', 'CG');
  await press('Manual');
  fill('Ex: 50', '50');
  let finish;
  onComplete.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const submit = screen.root.findAllByType(TouchableOpacity).find(node =>
    node.findAllByType(Text).some(child => child.props.children === 'Finalizar Cadastro'));
  let pending;
  act(() => { pending = submit.props.onPress(); });
  expect(text()).toContain('Enviando...');
  await press('Enviando...');
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.root.findByProps({ accessibilityLabel: 'Voltar' }).props.disabled).toBe(true);
  await act(async () => { finish(); await pending; });
  expect(text()).toContain('Finalizar Cadastro');
});
