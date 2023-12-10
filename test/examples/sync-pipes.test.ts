import {take} from 'take-n-pipe';

const countryDisplayNames: Map<string, string> = new Map([
  ['AF', 'Afghanistan'],
  ['AL', 'Albania'],
  ['DZ', 'Algeria'],
  ['AS', 'American Samoa'],
  ['AD', 'Andorra'],
]);

const inputData: string = 'AR';

test('Example: synchronous pipes', () => {
  // 1. Take country code as input
  const pipeOutput: string = take(inputData)
    // 2. Validate if it's valid, 2 letters ISO code
    .pipe((code: string) => {
      if (!/^[A-Z]{2}$/.test(code)) throw new Error('Invalid country code');
      else return code;
    })
    // 3. Map with country display name
    .pipe(countryDisplayNames.get.bind(countryDisplayNames))
    // 4. Throw error if display name for this country wasn't found
    .pipe((displayName: string | undefined) => {
      if (!displayName) throw new Error('Display name not found.');
      else return displayName;
    })
    /* 5. Catch errors, then:
     *   - find out if error is related to missing display name issue;
     *   - and replace it with 'Unknown country name' placeholder.
     */
    .catch((e: unknown) => {
      if (e instanceof Error && e.message === 'Display name not found.') return 'Unknown country name'; // placeholder

      throw e; // On the other hand - throw the error further
    })
    /* 6. Obtain results
     * Be aware that calling `get()` method can throw errors raised during pipe chaining.
     */
    .get();

  expect(pipeOutput).toBe('Unknown country name');
});
