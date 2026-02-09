import * as Contacts from 'expo-contacts';
import { Compromisso, ContactSuggestion } from '../models';
import { CompromissoRepository } from '../repositories/CompromissoRepository';
import { database } from '../repositories/Repository';

export class RelationshipService {
    private _compromissoRepo: CompromissoRepository | null = null;

    private get compromissoRepo(): CompromissoRepository {
        if (!this._compromissoRepo) {
            this._compromissoRepo = new CompromissoRepository(database.getDb());
        }
        return this._compromissoRepo;
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async getCompromissos(): Promise<Compromisso[]> {
        return await this.compromissoRepo.list();
    }

    async getCompromissosByDate(date: string): Promise<Compromisso[]> {
        return await this.compromissoRepo.getByDate(date);
    }

    async createCompromisso(compromisso: Omit<Compromisso, 'id'>): Promise<Compromisso> {
        return await this.compromissoRepo.create({
            ...compromisso,
            id: this.generateId(),
            status: compromisso.status || 'pendente'
        });
    }

    async updateCompromisso(id: string, compromisso: Partial<Compromisso>): Promise<Compromisso> {
        return await this.compromissoRepo.update(id, compromisso);
    }

    async deleteCompromisso(id: string): Promise<boolean> {
        return await this.compromissoRepo.delete(id);
    }

    /**
     * Helper to get upcoming commitments
     */
    async getUpcomingCompromissos(limit: number = 3): Promise<Compromisso[]> {
        const now = new Date();
        const all = await this.getCompromissos();
        return all
            .filter(c => new Date(c.data_hora) >= now)
            .sort((a, b) => a.data_hora.localeCompare(b.data_hora))
            .slice(0, limit);
    }

    async getRandomContact(): Promise<ContactSuggestion | null> {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access contacts was denied');
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length === 0) {
            return null;
        }

        // Filter contacts with at least one phone number
        const contactsWithPhone = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);

        if (contactsWithPhone.length === 0) {
            return null;
        }

        const randomContact = contactsWithPhone[Math.floor(Math.random() * contactsWithPhone.length)];

        return {
            name: randomContact.name,
            phoneNumber: randomContact.phoneNumbers![0].number || ''
        };
    }
}

export const relationshipService = new RelationshipService();
