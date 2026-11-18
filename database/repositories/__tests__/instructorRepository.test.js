import { addInstructor } from '../instructorRepository';
import { getDatabase } from '../../connection';

jest.mock('../../connection', () => ({ getDatabase: jest.fn() }));

it('salva o CPF do instrutor para permitir detectar cadastros duplicados', async () => {
  const runAsync = jest.fn().mockResolvedValue(undefined);
  getDatabase.mockResolvedValue({ runAsync });
  const instructor = {
    id: 'inst-1', name: 'Maria', car: 'Honda Fit', carImage: '', vehicleType: 'Carro',
    rating: 0, pricePerHour: 50, transmission: 'Manual', bio: '', reviews: [],
    availability: [], profileImage: '', coverImage: '', specialties: [],
    isAvailable: false, location: 'Manaus', coordinates: { latitude: 0, longitude: 0 },
  };
  await addInstructor(instructor, '52998224725');
  const [sql, values] = runAsync.mock.calls[0];
  const columns = sql.match(/INSERT INTO instructors \(([^)]+)\)/)[1].split(',').map(s => s.trim());
  expect(values).toHaveLength(columns.length);
  expect(values[columns.indexOf('cpf')]).toBe('52998224725');
  await addInstructor(instructor);
  expect(runAsync.mock.calls[1][1][columns.indexOf('cpf')]).toBeNull();
});
