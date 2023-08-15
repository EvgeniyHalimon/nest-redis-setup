import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getPokemon(id: number): Promise<string> {
    console.log('🚀', id);
    // check if data is in cache:
    const cachedData = await this.cacheService.get<{ name: string }>(`${id}`);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return `${cachedData.name}`;
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );
    console.log('/B');
    await this.cacheService.set(`${id}`, data);
    return `${data.name}`;
  }
}
