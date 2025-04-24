import bcrypt from 'bcryptjs';

class Hashing {
  async Generate(charSequence) {
    const theHash = await bcrypt.hash(charSequence, 8);
    return theHash;
  }

  async Compare(charSequence, hash) {
    const hashCompare = await bcrypt.compare(charSequence, hash);
    return hashCompare;
  }
}

export default new Hashing();
