using System.Runtime.CompilerServices;

namespace Shared;

public class DomainException(string message) : Exception(message);
